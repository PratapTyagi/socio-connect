import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import axios from "axios";
import io from "socket.io-client";

import "./Chat.css";

const Chat = () => {
  const { roomId } = useParams();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [input, setinput] = useState("");
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const { pathname } = useLocation();
  const [socket, setSocket] = useState(null);

  // Room info
  useEffect(() => {
    const rooms = JSON.parse(localStorage.getItem("rooms"));
    const data = rooms.filter((e) => e._id === roomId);
    setRoom(data[0]);
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    let timestamp = new Date();
    timestamp =
      (timestamp.getHours() > 12
        ? timestamp.getHours() - 12
        : timestamp.getHours()) +
      ":" +
      timestamp.getMinutes() +
      (timestamp.getHours > 12 ? "PM" : "AM");
    await axios.post(
      "/messages/new",
      {
        username: currentUser.name,
        message: input,
        timestamp,
        roomId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setinput("");
  };

  // All messages
  useEffect(() => {
    axios
      .post(
        "/messages/sync",
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => setMessages(data))
      .catch((err) => console.log(err));
  }, [roomId, token]);

  // Socket
  useEffect(() => {
    const sock = io();
    setSocket(sock);
    return () => sock.close();
  }, []);

  useEffect(() => {
    socket?.on("messages", (data) =>
      setMessages((prevState) => [...prevState, data])
    );
  }, [socket]);

  return (
    <div className="chat">
      <div className="chat_header">
        <div className="chat_headerInfo">
          <h5>{room.name || "Room name"}</h5>
          <p>Last seen at</p>
        </div>

        <Link
          className="link"
          to={`${pathname}/allusers`}
          style={{ textDecoration: "none", color: "none", marginRight: "10px" }}
        >
          <button>Add User</button>
        </Link>
      </div>

      <div className="chat_body">
        {messages.map((m) => (
          <p
            key={m._id}
            className={`chat_message ${
              m.received === currentUser._id && "chat_receiver"
            }`}
          >
            {m.received !== currentUser._id && (
              <span className="chat_name">{m.username}</span>
            )}
            {m.message}
            <span className="chat_timestamp">{m.timestamp}</span>
          </p>
        ))}
      </div>

      <div className="chat_footer">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setinput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">></button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
