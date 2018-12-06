import React from 'react';
import { Icon } from 'antd'

class Footer extends React.Component {

    render() {

        return (
            <footer className={`${this.props.homepage ? "home-footer" : "build-content"}`}>

                <div className="footer-content">

                    <div className="footer-icons">
                        <span>
                            <a href="https://twitter.com/countdown_cals" target="_blank" rel="noopener noreferrer">
                                <Icon type="twitter" theme="outlined" />
                            </a>
                        </span>

                        <span>
                            <a href="https://fb.me/countdowncals" target="_blank" rel="noopener noreferrer">
                                <Icon type="facebook" theme="outlined" />
                            </a>
                        </span>

                        <span>
                            <a href="https://www.instagram.com/countdown_cals/" target="_blank" rel="noopener noreferrer">
                                <Icon type="instagram" theme="outlined" />
                            </a>
                        </span>

                        <span className="email-text">
                            <a href="mailto:hello@countdowncals.com?subject=Hello" target="_blank" rel="noopener noreferrer">
                                <small>
                                    hello@countdowncals.com
                                </small>
                            </a>
                        </span>

                    </div>

                    <div className="footer-text">
                        <a href="https://andrewcodes404.com" target="_blank" rel="noopener noreferrer">
                            <small>~ made in london ~</small>
                        </a>
                    </div>

                </div>


            </footer >


        );
    }
}

export default Footer