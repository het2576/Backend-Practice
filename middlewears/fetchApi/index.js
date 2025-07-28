/**
 * Assignment #5 - Write an HTML file, that hits the backend server using `fetch` API
 * 
 * Use the following command to run this file
 *  $ cd public
 *  $ npx serve
 *
 * npx server command is used to serve a foler over http server
 */


const express = require("express");


const cors = require("cors");


const app = express();


app.use(express.json());


app.use(cors());


app.post("/sum", function (req, res) {
    // get the values of a and b from the query parameters and convert them to integers
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);

  
    console.log(a, b);

   
    res.json({
        ans: a + b,
    });
});


app.listen(3001);