import express from 'express'

const app=express();

function add(a,b){
    return a+b;
}

function multiply(a,b){
    return a*b;
}

app.get('/add',(req,res)=>{
 const a=parseInt(req.query.a);
 const b=parseInt(req.query.b);
 res.send(`The sum of ${a} and ${b} is ${add(a,b)}`);
})

app.get('/multiply',(req,res)=>{
    const a=parseInt(req.query.a);
    const b=parseInt(req.query.b);
    res.send(`The product of ${a} and ${b} is ${multiply(a,b)}`);
})
app.listen(3000);