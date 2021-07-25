const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id: String,
    name: String,
    prequisites: Array,
    corequisite: String,
    credit: String,
    group: String,
    type: String,
    seat: Number
})

module.exports = mongoose.model("Courses", schema)