const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validate } = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalide edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} , your profile updated`,
            data: loggedInUser,
        });

    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
});

module.exports = profileRouter;