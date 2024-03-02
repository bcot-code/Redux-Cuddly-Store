const { User, Product, Category, Order } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const stripe = require("stripe")("skt_test4eC39HqLyjWDarjtT1zd7dc");

const resolvers = {
  Query: {
    categories: async () => await Category.find(),
    products: async (parent, { category, name }) => {
      let params = {};
      if (category) params.category = category;
      if (name) params.name = name;
      return await Product.find(params).populate("category");
    },
    product: async (parent, { id }) => {
      return await Product.findById(id).populate("category");
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: "orders.products",
          populate: "category",
        });
        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
        return user;
      }
      throw new AuthenticationError("Not logged in");
    },
    order: async (parent, { id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user.id).populate({
          path: "order.products",
          populate: "category",
        });
        return user.order.id(_id);
      }
      throw new AuthenticationError("Not logged in");
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: context.cart });
      const lineItems = [];
      const { products } = await order.populate("products");
      for (let i = 0; i < products.length; i++) {
        const item = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/$/${products[i].image}`],
        });
        const price = await stripe.prices.create({
          product: item.id,
          unit_amount: products[i].price * 100,
          currency: "usd",
        });
        lineItems.push({
          price: price.id,
          quantity: products[i].quantity,
        });
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        lineItems,
        mode: "payment",
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });
      return { session: session.id };
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      // hash the password
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    addOrder: async (parent, { product }, context) => {
      if (context.user) {
        const order = new Order({ product });
        await User.findByIdAndUpdate(context.user._id, {
          $push: { orders: order },
        });
        return order;
      } else throw new AuthenticationError("Not logged in");
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }
      throw AuthenticationError;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const valid = await user.isCorrectPassword(password);
      if (!valid) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
