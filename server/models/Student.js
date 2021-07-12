const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id: String,
    name: String,
    result: Array,
    credit: String,
    dept: String
})

module.exports = mongoose.model("Students", schema)