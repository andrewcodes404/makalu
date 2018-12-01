import React from 'react';
import { withRouter } from 'react-router-dom'
class NotFound extends React.Component {

goHome = () => {
    console.log('clicked');
    this.props.history.push('/')
    
}

    render() {

        
        return (
            <div className="not-found-page">

                <div>
                    <div className="video-cont">
                        <video autoPlay loop muted id="vid" poster="https://source.unsplash.com/AgWVcQz1bOA">
                            <source src="https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/Snow-motion.mp4" type="video/mp4" />

                        </video>
                    </div>
                </div>


                <div className="not-found-text-cont">
                    <div className="not-found-text">
                        <h1>Uh-oh, no calendar here <span className="cat" role="img" aria-label="emoji">🙀</span> </h1>

                        <h2 className="text-center"> <span className="go-home" onClick={this.goHome}>let's -&gt; go home &lt;- </span>  </h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(NotFound)