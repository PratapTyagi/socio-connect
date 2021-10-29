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
  Sidebar,
  DefaultChat,
  Chat,
  AllUsers
} from "./components";
import { initialState, reducer } from "./reducers/userReducer";
import "./App.css";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
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
          <Route exact path="/chat">
            <div className="margin app__body">
              <Sidebar />
              <DefaultChat />
            </div>
          </Route>
          <Route exact path="/chat/room/:roomId">
            <div className="margin app__body">
              <Sidebar />
              <Chat />
            </div>
          </Route>
          <Route exact path="/chat/room/:roomId/allusers">
            <div className="margin app__body">
              <Sidebar />
              <AllUsers />
            </div>
          </Route>
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
