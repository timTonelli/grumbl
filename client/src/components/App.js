import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import getCurrentUser from "../services/getCurrentUser";
import "../assets/style/tailwind.css";
import AuthenticatedRoute from "./authentication/AuthenticatedRoute"
import RegistrationForm from "./registration/RegistrationForm";
import SignInForm from "./authentication/SignInForm";
import TopBar from "./layout/TopBar";
import RoomCreator from "./room/RoomCreator";
import RoomShowPage from "./RoomShowPage";
import LandingPage from "./LandingPage";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch(err) {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])
  // 
  return (
    <Router>
      <div className="h-screen bg-gradient-to-tl from-[#ffddd2] to-[#F4F1BB]">
        <TopBar user={currentUser} />
        <div className="">
          <Switch>
            <Route exact path="/">
              <LandingPage user={currentUser} />
            </Route>
            <AuthenticatedRoute 
              exact path="/rooms/new" 
              component={RoomCreator}
              user={currentUser}
            />
            <AuthenticatedRoute 
              exact path="/rooms/:roomId" 
              component={RoomShowPage} 
              user={currentUser}
              {...props}
            />
            <Route exact path="/users/new" component={RegistrationForm} />
            <Route exact path="/user-sessions/new" component={SignInForm} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default hot(App);
