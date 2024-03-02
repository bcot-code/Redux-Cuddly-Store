const mongoose = require("mongoose");

const { Schema } = mongoose;
// Create the schema for a Product.
const productSchema = new Schema({
  name: { type: String, required: true }, // The name of the product.
  description: { type: String, default: "" }, // A brief description of what the product is about.
  image: { type: String },
  price: { type: Number, required: true, min: 0.99 }, // Price in cents (e.g., $1.00)
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
