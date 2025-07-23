import express from 'express'

const app = express();

function isOldEnoughMiddlewear(req, res, next) {
    const age = req.query.age;
    if (age >= 15) {
        next();
    } else {
        res.status(403).json({
            msg: " You are not old enough to ride this ride "
        })
    }
}

app.use(isOldEnoughMiddlewear); // This will be applied to all routes & its order matters.

app.get("/ride1", function (req, res) {
    res.json({
        msg: " You rode the 1st ride "
    })
})


app.get("/ride2", function (req, res) {
    res.json({
        msg: " You rode the 2nd ride "
    })
})

app.listen(3000);