const User = require("./User");
const Product = require("./Product");
const Category = require("./Category");
const Order = require("./Order");

module.exports = {
  User,
  Product,
  Category,
  Order,
};
// This is a relationship between the User and Product models. It indicates that each user can have many products (i.e., they own multiple products.)
