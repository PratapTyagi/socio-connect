import axios from "axios";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

const NewPassword = () => {
  const [password, setpassword] = useState("");
  const history = useHistory();
  const { token } = useParams();
  console.log(token);

  const update = async (e) => {
    e.preventDefault();

    await axios
      .post("/new-password", {
        password,
        token,
      })
      .then(({ data }) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "red accent-4" });
          return;
        } else {
          M.toast({ html: data.message, classes: "green darken-1" });
          history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login_page">
      <div className="login">
        <h4>Update Password</h4>
        <form className="login__form">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
          <button type="submit" onClick={update}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
