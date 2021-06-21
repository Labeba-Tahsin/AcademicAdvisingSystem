const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
})

module.exports = mongoose.model("Users", schema)