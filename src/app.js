const express = require("express");
const app = express();

app.get("/user", (req,res,next) => {
    console.log("1st handler");
    // res.send("Response");
    next();
});

app.get("/user", (req,res,next) => {
    console.log("2nd handler");
    // res.send("2nd Response");
    next();
});

app.get("/user", (req,res,next) => {
    console.log("3rd handler");
    // res.send("3rd Response");
    next();
});

app.get("/user", (req,res,next) => {
    console.log("4th handler");
    // res.send("4th Response");
    next();
});

app.get("/user", (req,res,next) => {
    console.log("5th handler");
    res.send("5th Response");
    // next();
});

app.listen(3000, ()=> {
    console.log("Server is succussfully listening on port 3000...");
});