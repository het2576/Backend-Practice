/*
You have been given an express server which has a few endpoints.

Your task is to create a global middleware (app.use) which will maintain a count of the number of 
requests made to the server in the global requestCount variable
*/


import express from 'express'


const app= express();

let requestCount =0;

app.use(function(req,res,next){
    requestCount++;
    next();
});

app.get('/user1',function(req,res){
    res.status(200).json({
        msg: "hello from the user1 endpoint"
    })
})

app.get('/user2',function(req,res){
    res.status(200).json({
        msg: "hello from the user2 endpoint"
    })
})

app.get('/requestCount',function(req,res){
    res.status(200).json({
        msg: "The number of requests made to the server is: "+requestCount
    })
})


app.listen(3000);



