const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    approved: Boolean
})

module.exports = mongoose.model("Users", schema)