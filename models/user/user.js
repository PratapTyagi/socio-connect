import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dark-01/image/upload/v1623783636/pixlr-bg-result_sa4w7l.png",
  },
});

export default mongoose.model("User", userSchema);
