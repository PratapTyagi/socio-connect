import express from "express";
import mongoose from "mongoose";
import authentication from "./routes/authentication/auth.js";
import post from "./routes/post/post.js";
import user from "./routes/user/user.js";
import messages from "./routes/message/message.js";
import rooms from './routes/rooms/rooms.js';
import dotenv from "dotenv";

import { Server } from "socket.io";
import { createServer } from "http";

import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(authentication);
app.use(post);
app.use(user);
app.use(messages);
app.use(rooms);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

// Socket setup
const io = new Server(server);
io.on("connection", function (socket) {
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

const database = mongoose.connection;

database.once("open", () => {
  const msg = database.collection("messages");
  const changeStream = msg.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      io.emit("messages", change.fullDocument);
    }
  });
});

mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo db");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting", err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT} port`));
