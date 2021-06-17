import express from "express";
const router = express.Router();
import User from "../../models/user/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../../config/keys.js";
const secret = keys.JWT_SECRET;
import requireLogin from "../../middlewares/requireLogin.js";

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello User");
});

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.json({ error: "Please add all the fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.json({ error: "User already exists with this email" });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
          pic,
        });
        user
          .save()
          .then((user) => res.json({ message: "Saved successfully" }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "Please enter email or password" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.json({ error: "Invalid Email or Password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.status(200).send({ message: "Successfully Signed In" });
          const token = jwt.sign({ _id: savedUser._id }, secret);
          const { _id, name, followers, following, pic } = savedUser;
          res.json({
            user: {
              _id,
              name,
              email,
              followers,
              following,
              pic,
            },
            message: "Logged In Successfully!",
            token: token,
          });
        } else return res.json({ error: "Invalid Email or password" });
      })
      .catch((err) => console.log(err));
  });
});

export default router;
