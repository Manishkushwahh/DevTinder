const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please Login");
        }

        const decodedMessage = await jwt.verify(token, "DEV@Tinder$169");
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
};

module.exports = {
    userAuth,
};