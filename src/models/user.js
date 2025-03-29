const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isLowercase, trim } = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        isLowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
    },
    about: {
        type: String,
        default: "This is default url of the user, There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum",
    },
    skills:{
        type: [String],
    },
},{ timestamps: true, });

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$169", { expiresIn : "7d"});
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
};


const User = mongoose.model("User", userSchema);
module.exports = User;