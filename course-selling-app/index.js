import express from 'express';
import  userRouter  from './routes/user.js';
import courseRouter from './routes/course.js';
import adminRouter from './routes/admin.js';
import jwt from 'jsonwebtoken';
import bcrpt from 'bcrypt';
import z, { json } from 'zod';
import mongoose from 'mongoose';

const app = express();
app.use(express.json())



app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

async function main() {
    await mongoose.connect("")
    app.listen(3000);
    console.log("listening on port 3000")
}
main()