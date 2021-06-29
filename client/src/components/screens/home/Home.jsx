import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";

import "./Home.css";
const Home = () => {
  const [info, setInfo] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [follow, setFollow] = useState([]);
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    axios
      .get("/allpost", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        setInfo(data.posts);
      })
      .catch((err) => console.log(err));
  }, [info]);

  useEffect(() => {
    axios
      .get("/all-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        setFollow(data);
      })
      .catch((error) => console.log(error));
  }, [follow]);

  useEffect(() => {
    axios
      .get("/followings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        setFollowings(data);
      })
      .catch((error) => console.log(error));
  }, [followings]);

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

  const followUser = async (id) => {
    await axios
      .put(
        "/follow",
        {
          followId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(({ data }) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setFollow(data.followers);
      })
      .catch((err) => console.log(err));
  };

  const unFollowUser = async (id) => {
    await axios
      .put(
        "/unfollow",
        {
          unfollowId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(({ data }) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setFollowings(data.following);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      <div className="left">
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
                      e.target[0].value = "";
                    }}
                  >
                    <input type="text" placeholder="Add a comment" />
                  </form>
                </div>
              </div>
            );
          })}
      </div>
      <div className="right">
        <div className="right__top">
          <h5>Follow</h5>
          <div className="right__top__persons">
            {follow.map((user) => (
              <div className="person">
                <Link className="link" to={`profile/${user._id}`}>
                  <div>
                    <img src={user.pic} alt="DP" />
                    <p>{user.name}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    followUser(user._id);
                  }}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="right__bottom">
          <h5>Followings</h5>
          <div className="right__bottom__persons">
            {followings.map((user) => (
              <div className="person">
                <Link className="link" to={`profile/${user._id}`}>
                  <div>
                    <img src={user.pic} alt="DP" />
                    <p>{user.name}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    unFollowUser(user._id);
                  }}
                >
                  UnFollow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
