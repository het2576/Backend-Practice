import Router from 'express';
import userMiddleware from '../middlewears/user.js';
import { courseModel,purchaseModel } from '../db.js';


const courseRouter = Router();

courseRouter.post('/purchase',async function(req,res){

    const {userId,courseId}=req.body;
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        msg: "You have successfully bought the course!"
    });
});

courseRouter.get('/preview',async function(req,res){
    const courses = await courseModel.find({
        userId
    });

    res.json({
        courses
    })
});

export default courseRouter;