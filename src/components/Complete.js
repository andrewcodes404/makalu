import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { calendarCompleteAC } from '../actions';
import { BitlyClient } from 'bitly';

import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,

    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon
} from 'react-share';

const bitly = new BitlyClient('38dc70e51766c771c92072cf1404cdf7213388ca', {});

class SectionPreviewComplete extends React.Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = { shortyUrl: "" };
    }

    handleShortUrl = async (longUrl) => {
        let result;
        try {
            result = await bitly.shorten(longUrl);
        } catch (e) {
            throw e;
        }

        const shortyUrl = result.url
        this.setState({ shortyUrl })
        return result;
    }

    componentDidMount() {
        this.handleShortUrl("https://countdowncals.com/" + this.props.user.id)
    }

    render() {
        console.log("this.props.user = ", this.props.user);
        const shortyUrl = this.state.shortyUrl
        const longUrl = "https://countdowncals.com/" + this.props.user.id
        const title = "Check out my 🎄 Christmas Countdown Calendar 🎄 "
        const fbTitle = "Check out my Christmas Countdown Calendar"
        const twitterTitle = "Check out my 🎄 Christmas Countdown Calendar 🎄 @countdown_cals"
        const emailTitle = "Check out my Christmas Countdown Calendar"
        const emailBody = "Check out my christmas countdown calendar " + shortyUrl
        const iconSize = 100
        const linkforProd = `https://countdowncals.com/${this.props.user.id}`

        return (
            <div className="the-big-page">
                <div className="x-page-content">
                    <div className="complete-cont">
                        <div className="link-cont">

                            <h1>Your calendar is ready! </h1>
                            <h1>Let the festivities commence</h1>
                            <h1 className="the-cal-link">
                                {process.env.NODE_ENV === 'production'
                                    ? (<a target="_blank" rel="noopener noreferrer" href={linkforProd}>
                                        {this.props.user.name}'s Countdown Calendar Link</a>)
                                    : (
                                        <a target="_blank" rel="noopener noreferrer" href={`localhost:3000/${this.props.user.id}`}>

                                            {this.props.user.name}'s Countdown Calendar Link</a>)}
                            </h1>

                        </div>

                        <h2>SO SO EASY to share</h2>
                        <h1><span role="img" aria-label="emoji">👇 </span> simply pick &amp; click<span role="img" aria-label="emoji">👇</span></h1>

                        <div className="share-btn-cont">
                            <div className="share-btn-wrapper">
                                <FacebookShareButton
                                    url={longUrl}
                                    quote={fbTitle}
                                    className="share-btn">
                                    <FacebookIcon
                                        size={iconSize}
                                        round />
                                </FacebookShareButton>
                            </div>

                            <div className="share-btn-wrapper">
                                <TwitterShareButton
                                    url={shortyUrl}
                                    title={twitterTitle}
                                    className="share-btn">
                                    <TwitterIcon
                                        size={iconSize}
                                        round />
                                </TwitterShareButton>

                                <div className="share-btn-wrapper__share-count">&nbsp;</div>
                            </div>

                            <div className="share-btn-wrapper">
                                <WhatsappShareButton
                                    url={shortyUrl}
                                    title={title}
                                    separator=":: "
                                    className="share-btn">
                                    <WhatsappIcon size={iconSize} round />
                                </WhatsappShareButton>

                                <div className="share-btn-wrapper__share-count">
                                    &nbsp;
                                </div>
                            </div>

                            <div className="share-btn-wrapper">
                                <EmailShareButton
                                    openWindow
                                    url={shortyUrl}
                                    subject={emailTitle}
                                    body={emailBody}
                                    className="share-btn">
                                    <EmailIcon
                                        size={iconSize}
                                        round />
                                </EmailShareButton>
                            </div>
                        </div>


                        <h1>Thank you for using CountdownCals</h1>
                        <br />
                        <h1 className="text-alert">A calendar is for life and not just for Christmas</h1>
                        <br/>
                        <p className="text-desc">Next year we will be launching the full fat version that lets you countdown to anything. Birthdays, weddings, conferences, retail sales, sports events.</p><p> Build some excitement and interest for any event. </p>
                        <br />

                        <h1 className="bold underline text-left">NEW FEATURES</h1>

                        <ul>
                        <br/>
                            <div className="li-cont text-left">
                                <li>Video &amp; images for each coutdown</li>
                                <li>personal messages on each calendar window</li>
                                <li>Create your own cover image</li>
                                <li>More colours and font options</li>
                                <li>Build multiple calendars</li>
                            </div>
                        </ul>
                        <br />
                        <p>If there's anything else you'd like to see we'd love to hear from you <a href="mailto:hello@countdowncals.com?subject=Hello" target="_blank" rel="noopener noreferrer">hello@countdowncals.com</a></p>
                    </div>
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

export default connect(mapStateToProps, { calendarCompleteAC })(withRouter(SectionPreviewComplete))