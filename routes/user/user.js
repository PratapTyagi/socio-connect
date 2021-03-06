import express from "express";

import Post from "../../models/post/post.js";
import User from "../../models/user/user.js";
import Room from "../../models/room/room.js";

import requireLogin from "../../middlewares/requireLogin.js";

const router = express.Router();

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({ error: error });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => res.status(404).json({ error: err }));
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        res.json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => {
          return res.json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => {
          return res.json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        res.json({ error: err });
      }
      res.json(result);
    }
  );
});

router.post("/search-user", requireLogin, (req, res) => {
  let userPattern = new RegExp(`^${req.body.query}`);
  User.find({ email: { $regex: userPattern } })
    .select("_id email name pic")
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

router.get("/all-user", requireLogin, (req, res) => {
  User.find()
    .select("_id name pic followers following")
    .then((user) => {
      User.findById({ _id: req.user._id })
        .then((currentUser) => {
          currentUser.following.push(req.user._id);
          let newUsers = user.filter(
            (item) => !currentUser.following.includes(item._id)
          );
          res.send(newUsers);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

// All users to whom user is following

router.get("/followings", requireLogin, (req, res) => {
  User.findById({ _id: req.user._id })
    .then((currentUser) => {
      User.find()
        .select("-password -email -__v")
        .then((user) => {
          let newUsers = user.filter((item) =>
            currentUser.following.includes(item._id)
          );
          res.send(newUsers);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

// List of users to whom user is following and want to add to room

router.post("/all-following-users", requireLogin, (req, res) => {
  Room.findById(req.body.roomId)
    .then((room) => {
      User.find({ _id: { $ne: req.user._id } })
        .select("-password -rooms -__v")
        .then((users) => {
          const result = users.filter(
            (item) => !room.members.includes(item._id) && req.user.following.includes(item._id)
          );
          res.json(result);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
})

// Add user to messenger room

router.put("/add-user", requireLogin, (req, res) => {
  const { roomId, userId } = req.body;

  Room.findByIdAndUpdate(
    roomId,
    {
      $push: { members: userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      User.findByIdAndUpdate(
        userId,
        {
          $push: { rooms: roomId },
        },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.json({ error: err });
        } else {
          return res.json(result);
        }
      });
    }
  });
});

export default router;
