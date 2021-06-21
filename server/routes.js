const express = require("express")
const User = require("../server/models/User"); // new
const Course = require("../server/models/Course"); // new
const router = express.Router()
const bcrypt = require("bcryptjs");
const fs = require('fs');

router.get("/api/users/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(500).send('No user found');
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({ message: "The password is invalid" });
        }
        res.send({ message: "The username and password combination is correct!" });
    } catch (error) {
        return res.status(500).send(error);
    }

    res.json(user);
});

router.get("/api/users", async (req, res) => {
    const users = await User.find()
    res.json(users);
});

router.post("/api/users", async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
    });
    try {
        const existingUser = await User.findOne({ username: req.body.username, email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ message: "This username or email already exists" });
        }
        await user.save();
    } catch (error) {
        return res.status(500).send(error);
    }

    res.json(user);
});

router.get("/api/courses", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        return res.status(500).send(error);
    }

});

router.post("/api/courses", async (req, res) => {
    const rawdata = fs.readFileSync(__dirname + '/resourses/courses.json');
    const courses = JSON.parse(rawdata);
    try {
        Course.insertMany(courses);
    } catch (error) {
        return res.status(500).send(error);
    }

    res.send("Courses uploaded successfully");
});

router.post("/api/course", async (req, res) => {
    const course = {
        id: req.body.id,
        name: req.body.name,
        prequisites: req.body.prequisites,
        corequisite: req.body.corequisite,
        credit: req.body.credit,
        group: req.body.group,
        type: req.body.type
    }
    try {
        await course.save();
        res.json(course);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put("/api/course", async (req, res) => {
    try {

        const course = await Course.findByIdAndUpdate(
            req.params.courseId,
            req.body,
            { new: true });
        res.json(course);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router