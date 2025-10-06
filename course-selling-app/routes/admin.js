import Router from 'express';
import { adminModel, courseModel } from '../db.js'

import jwt from 'jsonwebtoken';
const JWT_ADMIN_PASSWORD = "admin@123"
import adminMiddleware from '../middlewears/admin.js';
import bcrypt from 'bcrypt';
import z from 'zod';

const adminRouter = Router();

adminRouter.post('/signup', async function (req, res) {
    const requiredBody = z.object({
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string()
            .min(5).max(100)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    });

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        return res.status(400).json({ msg: "Incorrect Format!" });
    }

    const { email, password, firstName, lastName } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const existing = await adminModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        await adminModel.create({
            email,
            password: hashPassword,
            firstName,
            lastName
        });

        res.json({ msg: "Signup successful" });

    } catch (e) {
        console.error("Signup Error:", e);
        res.status(500).json({ msg: "Internal server error" });
    }
});

adminRouter.post('/signin', async function (req, res) {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
        return res.status(403).json({ msg: "Admin not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(403).json({ msg: "Incorrect password!" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.json({ token });
});

adminRouter.post('/course', adminMiddleware, async function (req, res) {

    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title,
        description,
        imageUrl,
        price
    })
    res.json({
        msg: "Course created!",
        courseId: course._id
    })
});


adminRouter.put('/course', adminMiddleware, async function (req, res) {

    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        id: courseId,
        creatorId: adminId,

        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
    })

    res.json({
        msg: "Course Updated!",
        courseId
    });
});


adminRouter.get('/course/bulk', adminMiddleware, async function (req, res) {

    const adminId = req.userId;
    const courses = await courseModel.find({
        creatorId: adminId
    })


    res.json({
        msg: " Course list",
        courses
    });
});

export default adminRouter;