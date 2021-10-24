import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const schema = mongoose.Schema({
    name: String,
    pic: {
        type: String,
        default:
            "https://res.cloudinary.com/dark-01/image/upload/v1623783636/pixlr-bg-result_sa4w7l.png",
    },
    members: [
        {
            type: ObjectId,
            ref: "users",
        },
    ],
    messages: [
        {
            type: ObjectId,
            ref: "messages",
        },
    ],
});

export default mongoose.model("rooms", schema);
