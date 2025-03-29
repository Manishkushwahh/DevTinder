const express = require("express");
const {ValidateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try{
        //Validate the data
        ValidateSignUpData(req);
        const{firstName, lastName, email, password, age, gender, photoUrl, about, skills} = req.body;

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating an instance of user from User model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
            skills,
        });

        await user.save();
        res.send("User Added successfully");
    }catch(error){
        res.status(400).send("Error : " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const{email,password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("Enter valid Email");
        }
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //Generate Token
            const token = await user.getJWT();
            res.cookie("token",token);
            res.send(user);
        }else{
            throw new Error("Invalid Credentials");
        }
    }catch(error){
        res.status(400).send("Error : " + error.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null,
        {expires: new Date(Date.now())}
    );
    res.send("Logout successfully");
});

module.exports = authRouter;