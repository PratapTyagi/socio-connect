import { useEffect, useState } from "react";
import axios from "../../../axios";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

import "./Signup.css";
const Signup = () => {
  const history = useHistory();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
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

  const uploadFields = async () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Wrong email format", classes: "red darken-3" });
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    )
      return M.toast({
        html: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        classes: "red darken-3",
      });

    let data = await axios
      .post("/signup", {
        name,
        email: email.toLowerCase(),
        password,
        pic: url === "" ? undefined : url,
      })
      .then(({ data }) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "red darken-3" });
        } else {
          M.toast({ html: data.message, classes: "green darken-1" });
          history.push("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  const register = (e) => {
    e.preventDefault();
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="register_page">
      <div className="register">
        <h4>Register</h4>
        <form className="register__form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
            autoComplete="false"
          />

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

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

          <button onClick={register}>Continue</button>
        </form>
        <p className="login__user">
          Already have an account
          <Link to="/login" style={{ textDecoration: "none" }}>
            <strong className="login__user__login"> Sign In</strong>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
