import { useEffect, useState } from "react";

import SidebarChat from "./SidebarChat";
import axios from "axios";
import "./Sidebar.css";

const Sidebar = () => {
  const [rooms, setrooms] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const logOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location = "/";
  };

  useEffect(() => {
    const apiReq = async () => {
      const { data } = await axios.get("/api/rooms/", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      return data;
    };

    apiReq()
      .then((info) => {
        setrooms(info);
        localStorage.setItem("rooms", JSON.stringify(info));
      })
      .catch((err) => console.log(err));
  }, [rooms, currentUser.token]);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <button onClick={logOut}>Logout</button>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
