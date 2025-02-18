const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        tpye: String,
    },
    phoneNumber: {
        tpye: Number,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;