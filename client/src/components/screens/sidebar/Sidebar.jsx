import { useContext, useEffect, useState } from "react";

import SidebarChat from "./SidebarChat";
import axios from "axios";
import "./Sidebar.css";
import { UserContext } from "../../../App";

const Sidebar = () => {
  const [rooms, setrooms] = useState([]);
  const token = localStorage.getItem("token");
  const { state } = useContext(UserContext);

  const logOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location = "/";
  };

  useEffect(() => {
    const apiReq = async () => {
      const { data } = await axios.get("/room/get-rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, [state, token]);

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
