import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../App";

import "./Profile.css";
const Profile = () => {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  useEffect(() => {
    axios
      .get("/mypost", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => setPosts(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "socio-connect");
      data.append("cloud_name", "dark-01");
      fetch("https://api.cloudinary.com/v1_1/dark-01/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          axios
            .put(
              "/updatepic",
              {
                pic: res.url,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then(({ data }) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: data.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: data.pic });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  return (
    <>
      {state ? (
        <div className="profile__page">
          <div className="profile">
            <div className="profile__image">
              <img src={state.pic} alt={state.name} />
            </div>
            <div className="profile__information">
              <div className="profile__information__top">
                <h4>{state.name}</h4>
                <button>Edit Profile</button>
              </div>
              <div className="profile__information__mid">
                <p>
                  <strong>{posts.mypost ? posts.mypost.length : 0}</strong>
                  posts
                </p>
                <p>
                  <strong>
                    {state.followers ? state.followers.length : 0}
                  </strong>
                  followers
                </p>
                <p>
                  <strong>
                    {state.following ? state.following.length : 0}
                  </strong>
                  following
                </p>
              </div>
              <div className="profile__information__description">
                <p>{state && state.name}</p>
                <p>About</p>
                <p>{state && state.email}</p>
              </div>
              <div className="file-field input-field">
                <div className="btn">
                  <span>Profile pic</span>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input type="text" className="file-path validate" />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="gallery">
            {posts &&
              posts.mypost &&
              posts.mypost.map((post) => {
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

export default Profile;
