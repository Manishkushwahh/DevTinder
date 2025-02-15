const express = require("express");
const app = express();

app.use("/test", (req,res) => {
    res.send("test test test test");
});

app.use("/hello", (req,res) => {
    res.send("hello hello hello hello");
});

app.listen(3000, ()=> {
    console.log("Server is succussfully listening on port 3000...");
});