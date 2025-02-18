const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req,res) => {
    //creating an instance of User model
    const user = new User({
        firstName: "Maish",
        lastName: "Kushwah",
        email: "manihskushwah169@gmail.com",
        password: "manishh169",
        phoneNumber: "8394971925",
    });

    try{
        await user.save();
        res.send("User Added successfully");
    }catch(error){
        res.status(400).send("Error... cannot send data" + error.message);
    }
});

connectDB()
    .then(() => {
        console.log("Successfully connected to Database");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        });
    })
    .catch((error) => {
        console.error("Cannot connect to database");
    });
