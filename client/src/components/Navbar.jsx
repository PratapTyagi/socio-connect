import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import axios from "axios";

import "./Navbar.css";
const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const searchModal = useRef(null);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return (
        <div className="right">
          <div className="link">
            <h6
              data-target="modal1"
              className="material-icons large modal-trigger"
            >
              search
            </h6>
          </div>
          <Link className="link" to="/chat" style={{ textDecoration: "none" }}>
            <h6 className="material-icons">chat_bubble_outline</h6>
          </Link>
          <Link
            className="link"
            to="/myfollowingsposts"
            style={{ textDecoration: "none" }}
          >
            <h6>Following posts</h6>
          </Link>
          <Link
            className="link"
            to="/profile"
            style={{ textDecoration: "none" }}
          >
            <h6>Profile</h6>
          </Link>
          <Link
            className="link"
            to="/create"
            style={{ textDecoration: "none" }}
          >
            <h6>Create</h6>
          </Link>
          <Link
            className="link"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
            }}
            to="/login"
            style={{ textDecoration: "none", backgroundColor: "red" }}
          >
            <h6>Logout</h6>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="right">
          <Link className="link" to="/login" style={{ textDecoration: "none" }}>
            <h6>Sign In</h6>
          </Link>
          <Link
            className="link"
            to="/signup"
            style={{ textDecoration: "none" }}
          >
            <h6>Sign Up</h6>
          </Link>
        </div>
      );
    }
  };

  const fetchUser = async (query) => {
    setSearch(query);
    await axios
      .post(
        "/search-user",
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(({ data }) => setUserDetails(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link
          className="link"
          to={state ? "/" : "/login"}
          style={{ textDecoration: "none" }}
        >
          <h4>
            <i>S</i>σ𝓬ισ𝓬σηηє𝓬т
          </h4>
        </Link>
      </div>
      {renderList()}
      {/* Modal Structure  */}
      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content">
          SEARCH USER
          <span style={{ color: "red", fontSize: "12px" }}>
            {" "}
            *using email <br />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => fetchUser(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((user) => (
              <Link
                to={
                  state && user._id === state._id
                    ? "/profile"
                    : `/profile/${user._id}`
                }
                onClick={() => {
                  M.Modal.getInstance(searchModal.current).close();
                }}
              >
                <li
                  className="collection-item avatar"
                  key={user._id}
                  style={{ borderBottom: "1px solid lightgrey" }}
                >
                  <img src={user.pic} alt="" className="circle" />
                  <span className="title">{user.name}</span>
                  <p>{user.email}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
