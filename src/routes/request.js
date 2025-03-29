const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid request type :" + status,
            });
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                message: "User Not Found",
            });
        };

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({
                message: "Connection Request Already Exist!!!",
            });
        };

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} ${status} ${toUser.firstName}`,
            data: data,
        });

    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

requestRouter.post(
    "/request/received/:status/:requestId", 
    userAuth, 
    async (req, res) => {
        try {
            const loggedInUserId = req.user._id;
            const { status, requestId } = req.params;

            const allowedStatus = ["accepted", "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({
                    message: "Status is not valid",
                    data,
                });
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUserId,
                status: "interested"
            });
            if(!connectionRequest){
                return res.status(400).json({
                    message: "Connection Not Found",
                });
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();

            res.json({
                message: `${req.user.firstName} ${status} the request of ${connectionRequest.fromUserId}`,
            })

        } catch (err) {
            res.status(400).json({
                message: "ERROR :" + err.message,
            });
        }
    }
);

module.exports = requestRouter;