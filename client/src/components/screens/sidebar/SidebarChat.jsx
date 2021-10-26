import axios from "axios";

import "./SidebarChat.css";
import { Link } from "react-router-dom";

const SidebarChat = ({ addNewChat, room }) => {
  const currentUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const createChat = async () => {
    const fetchedName = prompt("Enter the name of room");
    if (fetchedName) {
      const res = await axios
        .post(
          "/room/new",
          {
            name: fetchedName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => console.log(err));
      console.log(res);
    }
  };

  return addNewChat ? (
    <div className="sidebarChat" onClick={createChat}>
      <div className="sidebarChat_right">
        <h2 onClick={createChat}>Add New Chat</h2>
      </div>
    </div>
  ) : (
    <Link to={`/chat/room/${room._id}`} style={{ textDecoration: "none" }}>
      <div className="sidebarChat">
        <img src={room.pic} alt="img" />
        <div className="sidebarChat_right">
          <h2>{room.name}</h2>
          <p>Last Message</p>
        </div>
      </div>
    </Link>
  );
};

export default SidebarChat;
