const mongoose = require("mongoose");

const { Schema } = mongoose;

// order schema model
const OrderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product", //  reference to the Product model
    },
  ],
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
