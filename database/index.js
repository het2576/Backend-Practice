import express, { response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, TodoModel } from './db.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';        //for hashing the password 
import z from 'zod';     //for input validation


mongoose.connect("mongodb+srv://admin:admin123@cluster0.ui07x4w.mongodb.net/todo-app")
const JWT_SECRET = "randomsecretkey&123";

const app = express();
app.use(express.json());

app.post('/signup', async function (req, res) {
    const requiredBody = z.object({                      //schema and constrains checks
        name: z.string().min(3).max(50),
        email: z.string().min(3).max(50).email(),
        password: z.string().min(5).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)

    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        res.json({
            msg: "Incorrect Format!"
        })
        return
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashPassword = await bcrypt.hash(password, 5);           //should await, because it returns a promise

    try {
        await UserModel.create({
            name: name,
            email: email,
            password: hashPassword
        })
    } catch (e) {
        return res.json({ message: "User already exists!" });
    }
    res.json({
        message: "You are signed up"
    })
});

app.post('/login', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    })

    if (!user) {
        res.status(403).json({
            msg: "User does not exist"
        })
    }

    const passMatch = await bcrypt.compare(password, user.password);       //should await, because it returns a promise

    if (passMatch) {
        const token = jwt.sign({
            id: user._id.toString()         /*  uniquily identify through id in db 
                                      so in the token we store user's id  */
        }, JWT_SECRET)
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect credentials!"
        })
    }

});

//using auth middlewear

app.post('/todo', auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done: done || false
    });

    res.json({
        message: "Todo created"
    })
});

app.get('/todos', auth, async function (req, res) {
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId
    });
    res.json({
        todos
    })

});

app.put('/todo/:id', auth, async function (req, res) {
    const userId = req.userId;
    const todoId = req.params.id;
    const { title, done } = req.body;

    const todo = await TodoModel.findOne({ _id: todoId, userId });
    if (!todo) {
        res.status(404).json({
            msg: "Todo not found"
        })
    }
    todo.title = title || todo.title;
    todo.done = (done !== undefined) ? done : todo.done;

    await todo.save();
    res.json({
        msg: "todo updated"
    })
});

app.delete('/todo/:id', auth, async function (req, res) {
    const userId = req.userId;
    const todoId = req.params.id;

    const todo = await TodoModel.findOne({ _id: todoId, userId });

    if (!todo) {
        res.status(404).json({
            msg: "Todo not found"
        })
    }
    await TodoModel.deleteOne({ _id: todoId, userId });
    res.json({
        msg: "Todo Deleted"
    })

});


function auth(req, res, next) {        //auth middlewear
    const token = req.headers.token
    const response = jwt.verify(token, JWT_SECRET)
    if (response) {
        req.userId = token.userId
        next();
    } else {
        res.status(403).json({
            msg: "Incorrect credentials"
        })
    }
}

app.listen(3000, () => {
    console.log('server is running on port 3000')
});

