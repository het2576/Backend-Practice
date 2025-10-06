import Router from 'express';
import {userModel } from '../db.js'

import jwt from 'jsonwebtoken';
const JWT_USER_PASSWORD = "user@123"
import userMiddleware from '../middlewears/user.js';
import bcrypt from 'bcrypt';
import z from 'zod';

const userRouter = Router();

userRouter.post('/signup', async function (req, res) {
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
        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        await userModel.create({
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

userRouter.post('/signin', async function (req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(403).json({ msg: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ msg: "Incorrect password!" });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
    res.json({ token });
});

userRouter.get('/purchases',function(req,res){
    res.json({
        msg: "purchases endpoint"
    });
});

export default userRouter;
