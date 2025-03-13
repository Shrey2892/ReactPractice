const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// Define the schema for the User collection
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //createdAt: { type: Date, default: Date.now },
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password); // Compare the provided password with the stored hash
};

// Create and export the User model
const Users = mongoose.model("Users", userSchema);

module.exports = Users;
