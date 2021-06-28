import { createContext, useContext, useEffect, useReducer } from "react";
import { HashRouter as Router, Route, useHistory } from "react-router-dom";
import {
  Navbar,
  Home,
  Login,
  Profile,
  SignUp,
  CreatePost,
  User,
  UserFollowing,
  ForgotPassword,
  NewPassword,
} from "./components";
import { initialState, reducer } from "./reducers/userReducer";
import "./App.css";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  let user;

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    if (state || user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset-password"))
        history.push("/login");
    }
  }, []);

  return (
    <>
      {!state ? (
        <>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/reset-password" exact component={ForgotPassword} />
          <Route path="/reset-password/:token" exact component={NewPassword} />
        </>
      ) : (
        <>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/reset-password" exact component={ForgotPassword} />
          <Route path="/reset-password/:token" exact component={NewPassword} />
          <Route path="/myfollowingsposts" exact component={UserFollowing} />
          <Route path="/profile/:userid" exact component={User} />
          <Route path="/create" exact component={CreatePost} />
        </>
      )}
    </>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="app">
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <Navbar />
          <Routing />
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
