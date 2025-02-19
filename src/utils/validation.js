const validator = require("validator");

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

module.exports = {
    ValidateSignUpData,
};