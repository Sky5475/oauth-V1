const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  userId: String,
  access_token: String,
  refresh_token: String 
})
module.exports = mongoose.model("Users", usersSchema);
