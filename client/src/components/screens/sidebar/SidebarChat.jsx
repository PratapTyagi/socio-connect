import axios from "axios";

import "./SidebarChat.css";
import { Link } from "react-router-dom";

const SidebarChat = ({ addNewChat, room }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const createChat = async () => {
    const fetchedName = prompt("Enter the name of room");
    if (fetchedName) {
      await axios
        .post(
          "/api/rooms/new",
          {
            name: fetchedName,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        )
        .catch((err) => console.log(err));
    }
  };

  return addNewChat ? (
    <div className="sidebarChat" onClick={createChat}>
      <div className="sidebarChat_right">
        <h2 onClick={createChat}>Add New Chat</h2>
      </div>
    </div>
  ) : (
    <Link to={`/room/${room._id}`} style={{ textDecoration: "none" }}>
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
