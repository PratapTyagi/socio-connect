import express from "express";

import Message from "../../models/message/message.js";
import Room from "../../models/room/room.js";

const router = express.Router();

import requireLogin from "../../middlewares/requireLogin.js";

router.post("/messages/sync", requireLogin, (req, res) => {
    const { roomId } = req.body;
    try {
        Room.findOne({ _id: roomId })
            .populate("messages", "username message timestamp received")
            .then((result) => {
                res.json(result.messages);
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/messages/new", requireLogin, (req, res) => {
    const { message, timestamp, roomId } = req.body;

    const data = new Message({
        username: req.user.name,
        message,
        timestamp,
        received: req.user._id,
    });

    try {
        data.save().then((savedMessage) =>
            Room.findByIdAndUpdate(
                roomId,
                {
                    $push: { messages: savedMessage._id },
                },
                { new: true }
            )
                .then((room) => {
                    return res.json(room);
                })
                .catch((err) => console.log(err))
        );
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
