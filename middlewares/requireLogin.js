import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
const secret = process.env.JWT_SECRET;

export default (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, secret, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
