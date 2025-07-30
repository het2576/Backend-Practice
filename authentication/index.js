import express from 'express'

const app = express();
app.use(express.json());

const users = [];

function generateTocken() {                                 //generate token
    return Math.random().toString(36).substr(2, 15);

}

app.post('/signup', function (req, res) {                    //signup
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })

    res.json({
        msg : 'you are signed up',
    })

    console.log(users);

})


app.post('/signin', function (req, res) {                   //signin
    
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i];
        }
    }
        if (foundUser) {
            const token = generateTocken();
            foundUser.token = token
            res.json({
                token: token
            })
        } else {
            res.status(403).send({
                message: "Invalid username or password"
            })
        }
    console.log(users);
})


app.get('/me',function(req,res){                            //get user info
    const token= req.headers.token;
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].token == token) {
            foundUser = users[i];
            }
    }
    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
            })
            } else {
                res.status(403).send({
                    message: "Invalid token"
                    })
            }
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
});