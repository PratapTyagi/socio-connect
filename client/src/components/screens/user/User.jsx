import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../App";

import "./User.css";
const User = () => {
  const { userid } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const initialShowFollow =
    state && state.following.includes(userid) ? false : true;
  const [showFollow, setShowFollow] = useState(initialShowFollow);

  useEffect(() => {
    axios
      .get(`/user/${userid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        setUserProfile(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const followUser = async () => {
    await axios
      .put(
        "/follow",
        {
          followId: userid,
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
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => console.log(err));
  };

  const unFollowUser = async () => {
    await axios
      .put(
        "/unfollow",
        {
          unfollowId: userid,
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
        setUserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {userProfile ? (
        <div className="profile__page">
          <div className="profile">
            <div className="profile__image">
              <img src={userProfile.user.pic} alt={userProfile.user.name} />
            </div>
            <div className="profile__information">
              <div className="profile__information__top">
                <h4>{userProfile.user.name}</h4>
                {showFollow ? (
                  <button onClick={followUser}>Follow</button>
                ) : (
                  <button onClick={unFollowUser}>UnFollow</button>
                )}
              </div>
              <div className="profile__information__mid">
                <p>
                  <strong>{userProfile.posts.length}</strong> Posts
                </p>
                <p>
                  <strong>
                    {userProfile.user.followers
                      ? userProfile.user.followers.length
                      : 0}
                  </strong>
                  Followers
                </p>
                <p>
                  <strong>
                    {userProfile.user.following
                      ? userProfile.user.following.length
                      : 0}
                  </strong>
                  Following
                </p>
              </div>
              <div className="profile__information__description">
                <p>{userProfile && userProfile.user.name}</p>
                <p>Homo sapien</p>
                <p>{userProfile && userProfile.user.email}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="gallery">
            {userProfile.posts.map((post) => {
              return (
                <img
                  key={post._id}
                  className="item"
                  src={post.photo}
                  alt={post.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h4
          style={{
            marginLeft: "40%",
            marginTop: "10%",
            color: "var(--theame-color)",
          }}
        >
          Loading ...
        </h4>
      )}
    </>
  );
};

export default User;
