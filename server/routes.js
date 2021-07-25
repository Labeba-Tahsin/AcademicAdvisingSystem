const express = require("express")
const User = require("../server/models/User"); // new
const Course = require("../server/models/Course"); // new
const Student = require("../server/models/Student"); // new
const router = express.Router()
const bcrypt = require("bcryptjs");
const fs = require('fs');

router.post("/api/users/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(500).send('No user found');
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send("The password is invalid");
        }
        if (!user.approved) {
            return res.status(400).send("Your profile is not approved yet.Please contact authority to approve your account.");
        }
        res.send({ message: "The username and password combination is correct!", user: user });
    } catch (error) {
        return res.status(500).send(error);
    }

    res.json(user);
});

router.get("/api/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.post("/api/users", async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
        approved: false
    });
    try {
        const existingUser = await User.findOne({ username: req.body.username, email: req.body.email });
        if (existingUser) {
            return res.status(400).send("This username or email already exists");
        }
        await user.save();
        res.send({ message: "Your account has been created.Please contact authority to approve your account." });
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

router.get("/api/eligible-courses/:id", async (req, res) => {
    try {
        const courses = await Course.find();
        const id = req.params.id;
        const student = await Student.findOne({ id: id });
        const result = student.result.map(x => x.id);

        const eleg = [];

        courses.forEach((elem, ind) => {
            if (elem.seat < 30 && elem.prequisites.every(i => result.includes(i)) || elem.prequisites.length === 0 || result.includes(elem.id)) {
                eleg.push(elem);
            }
        });

        res.json(eleg);
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

router.post("/api/students", async (req, res) => {
    const student = new Student({
        id: req.body.id,
        name: req.body.name,
        result: [],
        credit: req.body.credit,
        dept: req.body.dept
    });
    try {
        const existingStudent = await Student.findOne({ id: req.body.id });
        if (existingStudent) {
            return res.status(400).send("This student id already exists");
        }
        await student.save();
        res.send({ message: "Successfully created!" });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        return res.status(500).send(error);
    }

});

router.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        res.json(student);
    } catch (error) {
        return res.status(500).send(error);
    }

});

router.put("/api/students/:id", async (req, res) => {
    try {


        const student = await Student.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, useFindAndModify: false });
        res.json(student);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router