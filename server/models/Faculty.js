const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    dept: String
})

module.exports = mongoose.model("Faculties", schema)