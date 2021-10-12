const express = require("express")
const User = require("../server/models/User"); // new
const Course = require("../server/models/Course"); // new
const Student = require("../server/models/Student"); // new
const router = express.Router()
const bcrypt = require("bcryptjs");
const fs = require('fs');
const async = require('async');
const Advising = require("./models/Advising");
const Faculty = require("./models/Faculty");

router.post("/api/users/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
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
});

router.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({ username: { $ne: "admin" } });
        res.json(users);
    } catch (error) {
        return res.status(500).send(error);
    }
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

});

router.put(`/api/users/approve/:email`, async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.params.email });
        if (!existingUser) {
            return res.status(400).send("This user does not exists");
        }
        const user = await User.findByIdAndUpdate(
            existingUser.id,
            { approved: true },
            { new: true });

        res.send({ message: "User Approved" });
    } catch (error) {
        return res.status(500).send(error);
    }

});

router.put(`/api/users/password`, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("This user does not exists");
        }
        await User.findByIdAndUpdate(
            user.id,
            { password: bcrypt.hashSync(req.body.password, 10) },
            { new: true });

        res.send({ message: "Password set successfully" });
    } catch (error) {
        return res.status(500).send(error);
    }

});

router.delete(`/api/users/delete/:email`, async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.params.email });
        if (!existingUser) {
            return res.status(400).send("This user does not exists");
        }
        await User.findByIdAndDelete(existingUser.id);

        res.send({ message: "User Deleted" });
    } catch (error) {
        return res.status(500).send(error);
    }

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
        email: req.body.email,
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

router.post("/api/faculty", async (req, res) => {
    const faculty = new Faculty({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        dept: req.body.dept
    });
    try {
        const existing = await Faculty.findOne({ id: req.body.id });
        if (existing) {
            return res.status(400).send("This faculty id already exists");
        }
        await faculty.save();
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

router.post("/api/studentfind", async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.body.email });
        if (!student) {
            return res.status(400).send("This student's profile does not exist");
        }
        res.json(student);
    } catch (error) {
        return res.status(500).send(error);
    }

});

router.post("/api/facultyfind", async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ email: req.body.email });
        if (!faculty) {
            return res.status(400).send("This faculty's profile does not exist");
        }
        res.json(faculty);
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

router.post("/api/advising", async (req, res) => {
    const advising = new Advising({
        student_id: req.body.student_id,
        name: req.body.name,
        courses: req.body.courses,
        status: 'applied'
    });
    try {
        await advising.save();

        (async function () {
            for (const item of (req.body.courses)) {
                await Course.findOneAndUpdate(
                    { id: item.id },
                    { seat: item.seat - 1 },
                    { new: true, useFindAndModify: false });

            }
        })();
        res.send("Advising done successfully");

    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/api/advising/:id", async (req, res) => {

    try {
        const adv = await Advising.findOne({ student_id: req.params.id });
        if (!adv) {
            const student = await Student.findOne({ id: req.params.id });
            const advising = new Advising({
                student_id: req.params.id,
                name: student.name,
                courses: [req.body.course],
                status: 'applied'
            });
            await advising.save();
            await Course.findOneAndUpdate(
                { id: req.body.course.id },
                { seat: req.body.course.seat - 1 },
                { new: true, useFindAndModify: false });

            return res.json(advising);
        }

        const advUpdated = await Advising.findByIdAndUpdate(
            { _id: adv._id },
            { courses: [...adv.courses, req.body.course] },
            { new: true });

        await Course.findOneAndUpdate(
            { id: req.body.course.id },
            { seat: req.body.course.seat - 1 },
            { new: true, useFindAndModify: false });
        res.json(advUpdated);


    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/api/advising/approve/:id", async (req, res) => {

    try {
        const adv = await Advising.findOne({ student_id: req.params.id });
        if (!adv) {
            return res.status(400).send("This student has not done advising yet");
        }

        await Advising.findByIdAndUpdate(
            { _id: adv._id },
            { status: 'approved' },
            { new: true });

        res.send("Course deleted successfully");


    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete("/api/advising/:id/:course_id", async (req, res) => {

    try {
        const adv = await Advising.findOne({ student_id: req.params.id });
        if (!adv) {
            return res.status(400).send("This student has not done advising yet");
        }
        if (adv.courses.find(x => x.id === req.params.course_id) === undefined) {
            return res.status(400).send("This course has not advised yet");
        }

        await Advising.findByIdAndUpdate(
            { _id: adv._id },
            { courses: adv.courses.filter(x => x.id !== req.params.course_id) },
            { new: true, useFindAndModify: false });

        const crs = await Course.findOne({ id: req.params.course_id });

        await Course.findOneAndUpdate(
            { id: req.params.course_id },
            { seat: crs.seat + 1 },
            { new: true, useFindAndModify: false });

        res.send("Course deleted successfully");


    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get("/api/advising/:id", async (req, res) => {
    try {
        const adv = await Advising.findOne({ student_id: req.params.id });
        if (!adv) {
            return res.status(400).send("This student has not done advising yet");
        }
        res.json(adv);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router