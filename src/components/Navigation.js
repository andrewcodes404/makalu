import React from 'react';
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom'
import { auth } from '../firebase';

import logo from '../images/SVG/cc_logo.svg'

class Navigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            verified: null
        }
    }

    componentDidMount() {

        if (this.props.user.loggedIn && this.props.user.emailVerified) {
            this.setState({
                verified: true
            })
        } else {
            this.setState({
                verified: false
            })
        }
    }


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.user.loggedIn !== prevProps.user.loggedIn) {
            // this.fetchData(this.props.userID);
            this.verifyState()
        }
    }

    verifyState = () => {
        if (this.props.user.loggedIn && this.props.user.emailVerified) {
            this.setState({
                verified: true
            })
        } else {
            this.setState({
                verified: false
            })
        }
    }


    logOut = () => {
        auth.doSignOut().then(() => {
            this.props.history.push('/')
        }
        );
    }

    render() {

        return (

            <div className={`new-nav ${this.state.verified && "nav-verified"}`}>

                <div className="nav-text">
                    <p>CountdownCals.com *</p>
                </div>

                <div className="nav-logo-cont">

                    <img src={logo} alt="" />
                </div>

                <div className="nav-menu">
                    {this.state.verified
                        ? (<p className="menu-item" onClick={this.logOut}>
                            logout
                            </p>)
                        : (
                            <p className="menu-item" onClick={this.props.scrollToLogin}>
                                Login/Register
                            </p>
                        )
                        
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(withRouter(Navigation))