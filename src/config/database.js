const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://manishkushwah169:f0rIcm02GjwApLwJ@devtinder.z3r8s.mongodb.net/DevTinder");
};

module.exports = connectDB;

// mongodb+srv://manishkushwah169:9CbG8Q9cHjtJtSM7@mycluster.kitpp.mongodb.net/devTinder

// mongodb+srv://manishkushwah169:f0rIcm02GjwApLwJ@mycluster.kitpp.mongodb.net/devTinder

 // new password f0rIcm02GjwApLwJ