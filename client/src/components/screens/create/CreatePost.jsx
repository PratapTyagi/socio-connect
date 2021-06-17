import { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

import "./CreatePost.css";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      axios
        .post(
          "/createpost",
          {
            title,
            body,
            pic: url,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(({ data }) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red accent-4" });
            return;
          } else {
            M.toast({
              html: "Created Post Successfully",
              classes: "green darken-1",
            });
          }
        })
        .catch((error) => console.log(error));
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "socio-connect");
    data.append("cloud_name", "dark-01");
    fetch("https://api.cloudinary.com/v1_1/dark-01/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => setUrl(res.url))
      .catch((err) => console.log(err));
  };

  return (
    <div className="card input-filled">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn">
          <span>File</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input type="text" className="file-path validate" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #4D89F7 blue darker"
        onClick={postDetails}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
