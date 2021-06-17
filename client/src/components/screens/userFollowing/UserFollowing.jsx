import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";

import "./UserFollowing.css";
const UserFollowing = () => {
  const [info, setInfo] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("/getsubposts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        setInfo(data.posts);
      })
      .catch((err) => console.log(err));
  }, [info]);

  const likePost = (id) => {
    axios
      .put(
        "/like",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const newData = info.map((data) => {
          if (data._id == res._id) {
            return res;
          } else return data;
        });
        setInfo(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    axios
      .put(
        "/unlike",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const newData = info.map((data) => {
          if (data._id == res._id) {
            return res;
          } else return data;
        });
        setInfo(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    axios
      .put(
        "/comment",
        {
          text,
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const newData = info.map((item) => {
          if (item._id == res.data) {
            return res;
          } else {
            return item;
          }
        });
        setInfo(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postId) => {
    axios
      .delete(`/deletepost/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "red accent-4" });
          return;
        } else {
          const newData = info.filter((item) => item._id !== data.result._id);
          setInfo(newData);
          M.toast({
            html: data.message,
            classes: "green darken-1",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {info &&
        info.map((item) => {
          return (
            <div key={item._id} className="card home-card">
              <div className="card_header">
                <Link
                  className="link"
                  to={
                    item.postedBy._id !== state._id
                      ? `/profile/${item.postedBy._id}`
                      : `/profile`
                  }
                >
                  <h5>{item.postedBy.name}</h5>
                </Link>
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons delete"
                    onClick={(e) => {
                      e.preventDefault();
                      deletePost(item._id);
                    }}
                  >
                    delete
                  </i>
                )}
              </div>
              <div className="card-image">
                {item.photo !== "No Photograph" ? (
                  <img src={item.photo} alt={item.postedBy.name} />
                ) : null}
              </div>
              <div className="card-content">
                <div className="card-content-inner">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>
                  <span>{item.likes && item.likes.length}</span>

                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons thumb"
                      onClick={() => unlikePost(item._id)}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons thumb"
                      onClick={() => likePost(item._id)}
                    >
                      thumb_up
                    </i>
                  )}
                </div>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <strong>{record.postedBy.name}</strong> {record.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <input type="text" placeholder="Add a comment" />
                </form>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UserFollowing;
