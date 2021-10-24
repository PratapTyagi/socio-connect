import express from "express";
const router = express.Router();
import User from "../../models/user/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import requireLogin from "../../middlewares/requireLogin.js";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import crypto from "crypto";

const secret = process.env.JWT_SECRET;
var client = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SEND_GRID,
    },
  })
);

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
          .then((user) => {
            res.json({ message: "Saved successfully" });
            client.sendMail({
              from: "noreplysocioconnect@gmail.com",
              to: user.email,
              subject: "Sign up success",
              html: `<b>Hello ${user.name} ! Welcome to family :)</b>`,
            });
          })

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

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.json({ error: "User Doesn't exist with this email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        client.sendMail({
          from: "noreplysocioconnect@gmail.com",
          to: user.email,
          subject: "Reset Password",
          html: `
          <h2> You requested for password reset </h2>
          <h3> Click <a href="https://socio-connect-1.herokuapp.com/#/reset-password/${token}">Link</a> to reset password </h3>
          `,
        });
        res.json({ message: "Check your email" });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.json({ error: "Try again session expired" });
    }

    bcrypt
      .hash(newPassword, 12)
      .then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUserRecord) => {
          if (!savedUserRecord) {
            return res.json({ error: "Try again" });
          }
          res.json({ message: "Password updated successfully" });
        });
      })
      .catch((err) => console.log(err));
  });
});

export default router;
