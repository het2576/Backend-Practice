import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from './db.js';
import { TodoModel } from './db.js';
import mongoose from 'mongoose';


mongoose.connect("mongodb+srv://admin:admin123@cluster0.ui07x4w.mongodb.net/todo-app") 
const JWT_SECRET = "randomsecretkey&123";

const app =express();
app.use(express.json());

app.post('/signup',async function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    await UserModel.create({
        name: name,
        email: email,
        password: password 
    })
    res.json({
        message:"You are signed up"
    })
});

app.post('/login',async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const user = await UserModel.findOne({
        email:email,
        password:password
    })

    console.log(user)

    if(user){
        const token= jwt.sign({
            id: user._id.toString()         /*  uniquily identify through id in db 
                                      so in the token we store user's id  */
        },JWT_SECRET)
        res.json({
            token:token
        });
    }else{
        res.status(403).json({
            message: "Incorrect credentials!"
        })
    }
    
});

//using auth middlewear

app.post('/todo',auth,async function(req,res){
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});

app.get('/todos',auth,async function(req,res){
        const userId=req.userId
        const todos= await TodoModel.find({
            userId
        });
        res.json({
            todos
        })

});


function auth(req,res,next){        //auth middlewear
    const token=req.headers.token
    const response=jwt.verify(token,JWT_SECRET)
    if(response){
        req.userId=token.userId
        next();
    }else{
        res.status(403).json({
            msg:"Incorrect credentials"
        })
    }
}

app.listen(3000, () => {
    console.log('server is running on port 3000')
});

