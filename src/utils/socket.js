const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecrertRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
}

const initialzeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    });

    io.on("connection", (socket) => {
        // Handle Events
        socket.on("joinChat", ({userId, targetUserId, firstName}) => {
            const roomId = getSecrertRoomId(userId, targetUserId);
            console.log(firstName + " join room : " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({firstName, userId, targetUserId, text }) => {
            try {
                const roomId = getSecrertRoomId(userId, targetUserId);

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId]}
                });   
                
                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        message: []
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", {firstName, text});
            } catch (error) {
                console.log(error)
            }
        });

        socket.on("disconnect", () => {});
    });
};

module.exports = initialzeSocket;