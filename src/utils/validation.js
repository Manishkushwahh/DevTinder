const validator = require("validator");
const { aggregate } = require("../models/user");

const ValidateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName){
        throw new Error("Please enter your firstName");
    }else if(!lastName){
        throw new Error("Please enter your lastName");
    }else if(!validator.isEmail(email)){
        throw new Error("Please enter valid Email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }
};

const validateEditProfileData = (req) => {
    const editAllowedField = ["firstName", "lastName", "email", "password", "age", "gender", "photoUrl", "about", "skills"];
    const isAllowed = Object.keys(req.body).every((field) => editAllowedField.includes(field));
    return isAllowed;
};

module.exports = {
    ValidateSignUpData,
    validateEditProfileData,
};