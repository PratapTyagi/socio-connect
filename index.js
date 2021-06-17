import express from "express";
import mongoose from "mongoose";
import keys from "./config/keys.js";
import authentication from "./routes/authentication/auth.js";
import post from "./routes/post/post.js";
import user from "./routes/user/user.js";
import cors from "cors";
const app = express();
import path from "path";

mongoose.connect(keys.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo db");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting", err);
});

app.use(cors());
app.use(express.json());
app.use(authentication);
app.use(post);
app.use(user);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT} port`));
