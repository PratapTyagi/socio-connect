import { createContext, useContext, useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import {
  Navbar,
  Home,
  Login,
  Profile,
  SignUp,
  CreatePost,
  User,
  UserFollowing,
} from "./components";
import { initialState, reducer } from "./reducers/userReducer";
import "./App.css";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/create" exact component={CreatePost} />
      <Route path="/profile/:userid" exact component={User} />
      <Route path="/myfollowingsposts" exact component={UserFollowing} />
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
