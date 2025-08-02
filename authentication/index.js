import express from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = "randomsecretkey&123"

const app = express();
app.use(express.json());

const users = [];

function logger(req,res,next){                      //logger middleware(logs the req)
    console.log(req.method + " request came");
    next();
}

app.post('/signup', logger, function (req, res) {                    //signup
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })

    res.json({
        msg: 'you are signed up',
    })

})


app.post('/signin', logger, function (req, res) {                   //signin

    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i];
        }
    }
    if (foundUser) {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET)

        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
})


function auth(req, res, next) {                    // auth middlewear 
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);

    if (decodedData.username) {
        req.username= decodedData.username;
        next();
    }
    else {
        res.status(403).send({
            message: "Invalid token, You are not logged in"
        })
    }
}


app.get('/me', logger, auth, function (req, res) {                            //get user info

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === req.username) {
            foundUser = users[i];
        }
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    })

})

app.listen(3000, () => {
    console.log('server is running on port 3000')
});