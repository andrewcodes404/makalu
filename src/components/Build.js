import React from 'react';
import { connect } from 'react-redux'
import { addImageAC, deleteImageAC } from '../actions'
import { withRouter } from 'react-router-dom'

//style
// import { Icon } from 'antd'

//comps
import Navigation from "./Navigation";
import SectionUpload from "./SectionUpload";
import SectionCoverPicker from "./SectionCoverPicker";
import SectionMessage from "./SectionMessage";
import SectionPreview from "./SectionPreview";
import SectionChecklist from "./SectionChecklist";
import Complete from "./Complete";
import Footer from "./Footer";

class Build extends React.Component {

    constructor(props) {
        super(props);
        this.sectionPreview = React.createRef();
        this.sectionUpload = React.createRef();
        this.sectionCover = React.createRef();
        this.sectionMessage = React.createRef();
        this.state = {
            visible: false,
            uploadsComplete: false
        }
    }

    //   scrollToMessage = () => { window.scrollTo({ top: 0, behavior: "smooth" }); }

    scrollToUpload = () => { this.sectionUpload.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToCover = () => { this.sectionCover.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToMessage = () => { this.sectionMessage.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToPreview = () => { this.sectionPreview.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }


    // scrollToPreview = () => { window.scrollTo(5000, 1000); }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleSubmitPreview = () => {
        this.props.history.push('/preview')
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.user.calendarComplete !== prevProps.user.calendarComplete) {
            window.scrollTo(0, 0);
        }
    }



    render() {

        const imgCountNeeded = 24
        const imgCount = this.props.userImages.length
        const imgLeft = imgCountNeeded - imgCount
        let imgCountComplete
        if (imgCount >= imgCountNeeded) {
            imgCountComplete = true
        } else { imgCountComplete = false }



        if (this.props.user.isAuthenticating) return null;


        let checklistComplete = false
        if (this.props.user.xmasMessage && imgCountComplete && this.props.user.coverUrl) {
            checklistComplete = true
        }

        // console.log("this.props.user = ", this.props.user);


        return (
            <div className="master-build-cont">
                <Navigation username={this.props.user.name} />

                


                    {this.props.user.calendarComplete
                        ? (<>
                            <Complete />
                        </>)
                        : (
                            <>

                            <div className="">

                                {/* <div className="strip-top">

                               
                                        <h2>🎅 Ho Ho Ho... it's time to start making your countdown calendar.</h2>
                                        <h2>1) Upload 24 images from your folders, facebook or instagram (press the upload button to start).</h2>

                            
                                   
                                </div> */}
                                

                                <div ref={this.sectionUpload} >
                                    <SectionUpload />
                                </div>

                                {/* <div className="strip"> */}
                                    {/* <p>2) Now pick a cover image from the options below.</p> */}
                                {/* </div> */}

                                <div ref={this.sectionCover}>
                                    <SectionCoverPicker />
                                </div>

                                <div ref={this.sectionMessage}>
                                    <SectionMessage scrollToPreview={this.scrollToPreview} userId={this.props.user.id} username={this.props.user.name} />
                                </div>

                                <div ref={this.sectionPreview}>
                                    {checklistComplete
                                        ? <SectionPreview
                                            scrollToPreview={this.scrollToPreview}
                                        />
                                        : <SectionChecklist

                                            imgLeft={imgLeft}
                                            imgCountComplete={imgCountComplete}
                                            imgCount={imgCount}
                                            coverPicked={this.props.user.coverPicked}
                                            coverUrl={this.props.user.coverUrl}
                                            xmasMessage={this.props.user.xmasMessage}
                                            scrollToUpload={this.scrollToUpload}
                                            scrollToCover={this.scrollToCover}
                                            scrollToMessage={this.scrollToMessage}
                                        />
                                    }

                                </div>
                            </div>
                            </>
                        )}
               
                <div className="push-down-footer"></div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        userImages: state.user.userImages
    }
}

export default connect(mapStateToProps, { addImageAC, deleteImageAC })(withRouter(Build))