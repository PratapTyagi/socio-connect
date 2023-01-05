import axios from "../../../axios";
import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../../App";

import "./Login.css";
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const history = useHistory();

  const login = async (e) => {
    e.preventDefault();

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "red accent-4" });
      return;
    }

    await axios
      .post("/signin", {
        email: email.toLowerCase(),
        password,
      })
      .then(({ data }) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "red accent-4" });
          return;
        } else {
          M.toast({ html: data.message, classes: "green darken-1" });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          history.push("/");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login_page">
      <div className="login">
        <h4>Login</h4>
        <form className="login__form">
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
          <button type="submit" onClick={login}>
            Login
          </button>
        </form>
        <p className="register__user">
          <Link
            to="/signup"
            style={{ textDecoration: "none", marginBottom: "8px" }}
          >
            <span style={{ color: "grey" }}>Don't have an account</span>
            <strong className="register__user__signUp"> Sign Up</strong>
          </Link>
          <Link to="/reset-password" style={{ textDecoration: "none" }}>
            <span style={{ color: "grey" }}>Don't remember password</span>
            <strong className="register__user__signUp"> Forgot Pass.</strong>
          </Link>
        </p>
      </div>
      <div className="info">
        <h6>Demo credentials</h6>
        <h6>Email:</h6>
        <p>tyagipratap111@gmail.com</p>
        <h6>Password:</h6>
        <p>Qwert@111</p>
      </div>
    </div>
  );
};

export default Login;
