const express = require("express");
const app = express();

app.get("/user", (req,res) => {
    res.send({firstname:"Manish", lastname:"kushwah"});
});

app.post("/user", (req,res) => {
    res.send("Data is added to database succussfully");
});

app.delete("/user", (req,res) => {
    res.send("Data Deleted");
});

app.use("/test", (req,res) => {
    res.send("test test test test");
});



app.listen(3000, ()=> {
    console.log("Server is succussfully listening on port 3000...");
});