const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const Order = require("./Order");
// Create a schema for the user model.
const UserSchema = new Schema({
  firstName: { type: String, required: true, trim: true }, // The name of the user
  lastName: { type: String, required: true, trim: true }, // The lastname of the user
  email: { type: String, unique: true, lowercase: true }, // The email address used by the user to log in
  password: {
    type: String,
    required: "Please provide a password.",
    minlength: 8,
  }, // The password that will be hashed and stored
  order: [Order.schema], // An array containing all orders made by this user
});

UserSchema.pre("save", async function save(next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
// Compare the incoming pwd with the hashed pwd
UserSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = monogoose.model("User", UserSchema);
module.exports = User;
