import React from 'react';
import { connect } from 'react-redux'
import { addImageAC, deleteImageAC } from '../actions'
import { withRouter } from 'react-router-dom'

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

   
    scrollToUpload = () => { this.sectionUpload.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToCover = () => { this.sectionCover.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToMessage = () => { this.sectionMessage.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    scrollToPreview = () => { this.sectionPreview.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }


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

        const now = new Date();
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = "0" + now.getDate()
        const theDate = ("" + year + month + day)

        let daysUntilXmas = 20181225 - theDate
        if (daysUntilXmas > 24) {
            daysUntilXmas = 24
        }

        const imgCountNeeded = daysUntilXmas
        const imgCount = this.props.userImages.length
        const imgLeft = imgCountNeeded - imgCount
        let imgCountComplete
        if (imgCount >= imgCountNeeded) {
            imgCountComplete = true
        } else { imgCountComplete = false }



        let checklistComplete = false
        if (this.props.user.xmasMessage && imgCountComplete && this.props.user.coverUrl) {
            checklistComplete = true
        }



        if (this.props.user.isAuthenticating) return null;

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

                                <div ref={this.sectionUpload} >
                                    <SectionUpload imgCountNeeded={imgCountNeeded} />
                                </div>


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