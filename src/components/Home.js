import React from 'react';
import { Link } from 'react-router-dom'

//comps
import Login from "./authorise/Login";
import Register from "./authorise/Register";
import Navigation from "./Navigation";
import Footer from "./Footer";

//files
const calVid = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/cc_vid1_optimised.mp4"

const videoBkg = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/cc_vid_bkg2.jpg"


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.login = React.createRef();
        this.section2 = React.createRef();
        this.section3 = React.createRef();
    }

    scrollToLogin = () => { this.login.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToSection2 = () => { this.section2.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToSection3 = () => { this.section3.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); }


    render() {
        return (
            <div className="master-home-container">
                <Navigation scrollToLogin={this.scrollToLogin} />

                <div className="banner">
                <div className="banner-alert">
                <p>It's not too late!! You can create a countdown calendar starting from today Just  <span className="banner-alert-btn" onClick={this.scrollToLogin}> SIGN UP</span></p>
                </div>
                
                    <div className=" banner-video-cont">
                        <video src={calVid}
                            controls
                            muted
                            loop={true}
                            type="video/mp4"
                            poster={videoBkg}
                        ></video>
                    </div>
                </div>

                <div className="headline-strip">
                    <h1>Make your own digital advent calendar</h1>
                </div>

                <div className="strapline-strip">
                    <h2>Share your best photos of 2018 with family and friends</h2>
                </div>


                <div className="x-page-content">

                    <div className="the-three-steps">

                        <h2 className="three-steps-headline">Your countdown calendar in three easy steps:</h2>
                        <div className="step-item">

                            <div className="step-number">
                                <h3>1</h3>
                            </div>

                            <p>Login &amp; upload images from your folders, facebook or instagram.</p>
                        </div>

                        <div className="step-item">
                            <div className="step-number">
                                <h3>2</h3>
                            </div>
                            <p>Pick a cover image &amp; write a festive message.</p>
                        </div>

                        <div className="step-item">
                            <div className="step-number">
                                <h3>3</h3>
                            </div>
                            <p>Launch your calendar and share your unique link with friends &amp; family.</p>
                        </div>

                        <h2 className="three-steps-headline">Have look at an example here <Link to="/example/xmas">example-xmas-calendar</Link> </h2>
                    </div>
                </div>

                <div ref={this.login} className="x-login-reg-bkg">
                    <div className="x-page-content">
                        <div className="x-login-reg-cont">
                            <Register history={this.props.history} />
                            <Login history={this.props.history} />
                        </div>
                    </div>
                </div>

                <div className="push-down-footer"></div>
                <Footer homepage={true} />
            </div>


        );
    }
}

export default Home