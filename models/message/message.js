import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const schema = mongoose.Schema({
    username: String,
    message: String,
    timestamp: String,
    received: { type: ObjectId, ref: "users" },
});

export default mongoose.model("messages", schema);
