const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id: String,
    student_id: String,
    name: String,
    courses: Array,
    status: String
})

module.exports = mongoose.model("Advising", schema)