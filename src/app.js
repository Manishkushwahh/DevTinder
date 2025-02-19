const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {ValidateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

app.use(express.json());

app.post("/signup", async (req, res) => {
    try{
        //Validate the data
        ValidateSignUpData(req);
        const{firstName,lastName,email,password} = req.body;

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating an instance of user from User model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added successfully");
    }catch(error){
        res.status(400).send("Error : " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const{email,password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("Enter valid Email");
        }
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("User not found");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword){
            res.send("Login Successful");
        }else{
            throw new Error("Invalid Password");
        }
    }catch(error){
        res.status(400).send("Error : " + error.message);
    }
});

app.get("/user", async (req, res) => {
    const email = req.body.email;
    try {
       const users = await User.find({email : email}); 
       if(users.length === 0){
        res.send("User Not Found");
       }else{
        res.send(users);
       }
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});

app.delete("/user", async(req, res) => {
    const userId = req.body.userId;
    try {
        // const user = await User.findByIdAndDelete({_id: userId});
       const user = await User.findByIdAndDelete(userId); 
       res.send("User deleted successfully");
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});

app.patch("/user", async(req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "before",
        });
        res.send("Data updated successfully");
        console.log(user);
    } catch (error) {
        res.status(404).send("Something went wrong");
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
