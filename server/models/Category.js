const mongoose = require("mongoose");

const { Schema } = mongoose;

const cateSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
});
const Category = mongoose.model("Category", cateSchema);
module.exports = Category;
