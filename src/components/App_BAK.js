import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

//Redux
import { connect } from 'react-redux';
import { logInAC, logOutAC } from '../actions';

//Firebase
import { db } from '../firebase';
import { firebase } from '../firebase';

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


class App extends Component {

  componentDidMount() {
    //Check if user is logged in, a fn where we can check if the object is true
    firebase.auth.onAuthStateChanged(user => {
      if (user) {

        const id = user.uid;

        // // Email Verification -- TURNED OFF FOR DEV 👀 👇 👀 👇 👀 👇 👀
        let emailVerified = null;

        if (process.env.NODE_ENV === 'production') {
          emailVerified = user.emailVerified;
        } else {
          emailVerified = true;
        }

        // const emailVerified = user.emailVerified

        db.onceGetUser(id).then((snapshot) => {

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
      }
      else {
        this.props.logOutAC();
      }
    });

  }

  render() {

    //Stop everything until user logged in or not    
    if (this.props.user.isAuthenticating) return null;

    if (this.props.user.loggedIn && this.props.user.emailVerified) return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/examplebuild" component={ExampleBuild} />
            <Route path="/example/:calName" component={CalendarExample} />
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
            <Route path="/example/:calName" component={CalendarExample} />
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