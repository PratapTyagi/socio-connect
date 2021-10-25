import express from "express";

import Rooms from "../../models/room/room.js";
import User from "../../models/user/user.js";

import requireLogin from "../../middlewares/requireLogin.js";

const router = express.Router();

router.post("/room/new", requireLogin, (req, res) => {
    const { name, pic } = req.body;
    const data = new Rooms({
        name,
        members: req.user._id,
    });

    try {
        data
            .save()
            .then((room) => {
                User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $push: { rooms: room._id },
                    },
                    { new: true }
                ).exec((err, result) => {
                    if (err) {
                        return res.json({ error: err });
                    } else {
                        return res.json(result);
                    }
                });
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/room/get-rooms", requireLogin, (req, res) => {
    try {
        Rooms.find({ members: { $in: req.user._id } })
            .then((room) => {
                res.status(200).send(room);
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/room/get-room/:id", requireLogin, (req, res) => {
    try {
        Rooms.findOne({ _id: req.params.id })
            .then(room => {
                return res.status(200).send(room);
            })
            .catch((err) => console.log(err));
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;