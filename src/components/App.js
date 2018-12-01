// import React, { Component } from 'react';
import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

//Redux
import { connect } from 'react-redux';
import { logInAC, logOutAC } from '../actions';

//Firebase
import { db } from '../firebase';
import { auth } from '../firebase/firebase';

//Comps
import NotFound from "./NotFound";
import Build from "./Build";
import Calendar from "./Calendar";

import Forgot from "./authorise/Forgot";
import Home from "./Home";

import PrivacyPolicy from "./legal/PrivacyPolicy";
import Terms from "./legal/Terms";
import Cookie from "./legal/Cookie";

import ExampleBuild from "./ExampleBuild";
import CalendarExample from "./CalendarExample";

import Test from "./Test";

class App extends React.Component {

  componentDidMount() {
    //watching for change in Auth change   

    auth.onAuthStateChanged((user) => {

    if (user) {
      console.log("user = ", user);
      // // Email Verification -- TURNED OFF FOR DEV 👀 👇 👀 👇 👀 👇 👀
      let emailVerified = null;
      if (process.env.NODE_ENV === 'production') {
        emailVerified = user.emailVerified;
      } else {
        emailVerified = true;
      }

      db.onceGetUser(user.uid).then((snapshot) => {
        // careful - register user will auto login before 
        // user added to db so this checks if there is a snapshot 
        //before sending to redux
        if (snapshot.val()) {
          this.props.logInAC(snapshot.val(), emailVerified);
        } else {
          this.props.logOutAC();
        }
      })
      //with the authenticated ID we can acces that users data from the db and send it to the redux store    
      // if not call the LogoutAC to blank the store           
    } else {
      console.log('no user');

      this.props.logOutAC();
    }

    })
  }

  render() {

    //Stop everything until user logged in or not    
    if (this.props.user.isAuthenticating) return null;
    if (this.props.user.loggedIn && this.props.user.emailVerified) return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/examplebuild" component={ExampleBuild} />
            <Route path="/example/:id" component={CalendarExample} />
            <Route path="/cookie_policy" component={Cookie} />
            <Route path="/terms" component={Terms} />
            <Route path="/test" component={Test} />
            <Route path="/privacy_policy" component={PrivacyPolicy} />
            <Route path="/notfound" component={NotFound} />
            <Route path="/:uuidForCalendar" component={Calendar} />
            <Route exact path="/" component={Build} />
          </Switch>
        </BrowserRouter>
      </div>
    )
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/example/:id" component={CalendarExample} />
            <Route path="/forgot" component={Forgot} />
            <Route path="/cookie_policy" component={Cookie} />
            <Route path="/privacy_policy" component={PrivacyPolicy} />
            <Route path="/terms" component={Terms} />
            <Route path="/notfound" component={NotFound} />
            <Route path="/:uuidForCalendar" component={Calendar} />
          </Switch>
        </BrowserRouter>

      </div>
    );

  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { logInAC, logOutAC })(App)