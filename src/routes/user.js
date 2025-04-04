const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { set, isValidObjectId } = require("mongoose");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName about photoUrl";

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        })
            .populate("fromUserId", USER_SAFE_DATA);
            
        // console.log(connectionRequests);

        res.json({
            message: "Fetched data successfully!!",
            data: connectionRequests
        });


    } catch (err) {
        res.status.json({
            message: "ERROR :" + err.message,
        });
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"},
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        
        res.json({data,});

    } catch (err) {
        res.status(400).json({
            message: "ERROR :" + err.message, 
        });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        // /feed?page=1&limit=10
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.map((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$ne: loggedInUser._id} },
                {_id: {$nin: Array.from(hideUsersFromFeed)} },
            ]
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);
        
        res.send(users);
    }
    catch(err){
        res.status(400).json({
            message: "ERROR :" + err.message,
        });
    }
});

module.exports = userRouter;