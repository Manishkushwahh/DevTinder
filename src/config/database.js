const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://manishkushwah169:9CbG8Q9cHjtJtSM7@mycluster.kitpp.mongodb.net/devTinder");
};

module.exports = connectDB;