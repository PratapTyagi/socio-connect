import axios from "../../../axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";

const ForgotPassword = () => {
  const [email, setemail] = useState("");

  const reset = async (e) => {
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
      .post("/reset-password", {
        email,
      })
      .then(({ data }) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "red accent-4" });
          return;
        } else {
          M.toast({ html: data.message, classes: "green darken-1" });
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login_page">
      <div className="login">
        <h4>Reset Password</h4>
        <form className="login__form">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

          <button type="submit" onClick={reset}>
            Reset Password
          </button>
        </form>
        <p className="register__user">
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <span style={{ color: "grey" }}>Don't have an account</span>
            <strong className="register__user__signUp"> Sign Up</strong>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
