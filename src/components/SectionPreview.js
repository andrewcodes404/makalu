import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { db } from '../firebase';
import { calendarCompleteAC } from '../actions';

// style
import { Button } from 'antd'

///vars for time
const now = new Date();
const hour = now.getHours();
// const dayToday = now.getDate();
const dayToday = hour

class SectionPreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            imgPathArray: [],
            showXmasMessage: true,
            showGoAlert: false,
        }
    }


    componentDidUpdate(prevProps) {


        if (this.props.user.coverUrl !== prevProps.user.coverUrl) {

            this.props.scrollToPreview()

            //FIXME: if you open an image and chang the cover, the image is still there
            // MAKE ALL IMAGES {VISIBLE: FALSE}

            // for (let index = 0; index < 24; index++) {
            //     const newState = {
            //         ...this.state, imgPathArray: [
            //             ...this.state.imgPathArray.slice(0, index),
            //             { ...this.state.imgPathArray[index], visible: false },
            //             ...this.state.imgPathArray.slice(index + 1),
            //         ]
            //     }
            //     this.setState(newState)
            // }

            // this.state.imgPathArray.map((el, index) => {
            //         const newState = {
            //             ...this.state, imgPathArray: [
            //                 ...this.state.imgPathArray.slice(0, index),
            //                 { ...this.state.imgPathArray[index], visible: false },
            //                 ...this.state.imgPathArray.slice(index + 1),
            //             ]

            //     }
            //     this.setState({ ...this.state, imgPathArray[index].visible})
            // })


        }

        if (this.props.user.xmasMessage !== prevProps.user.xmasMessage) {

            this.setState({
                ...this.state, showXmasMessage: true
            })
            this.props.scrollToPreview()
        }


        // Typical usage (don't forget to compare props):
        if (this.props.user.userImages !== prevProps.user.userImages) {

            // create an array we can use for our img render
            let imgPathArray = []
            //map through the userImages and add to the array
            this.props.user.userImages.map((el, index) => {
                let dateIsGood = false
                let visible = false
                //We can use the index as a sort of date 
                //and check it against the real date
                if (dayToday >= index + 1) {
                    dateIsGood = true
                }
                if (dayToday > index + 1) {
                    visible = true
                }

                // push our new object to the array
                return imgPathArray.push({
                    path: el.path,
                    date: index + 1,
                    visible,
                    dateIsGood,
                    showModal: false
                })
            })

            //Lets Randomize that 👨‍🌾 🦀 🌾 🦀
            imgPathArray.sort(function () {
                return 0.5 - Math.random();
            });

            //Now add that to state
            this.setState({ imgPathArray })

        }
    }



    componentDidMount() {



        // create an array we can use for our img render
        let imgPathArray = []
        //map through the userImages and add to the array
        this.props.user.userImages.map((el, index) => {


            // push our new object to the array
            return imgPathArray.push({
                path: el.path,
                date: index + 1,
                visible: false,
                showModal: false
            })
        })

        //Lets Randomize that 👨‍🌾 🦀 🌾 🦀
        imgPathArray.sort(function () {
            return 0.5 - Math.random();
        });

        //Now add that to state
        this.setState({ imgPathArray })


    }



    handleShowImg = (index) => {
        console.log("index = ", index);
        if (!this.state.imgPathArray[index].visible) {
            const newState = {
                ...this.state, imgPathArray: [
                    ...this.state.imgPathArray.slice(0, index),
                    { ...this.state.imgPathArray[index], visible: true },
                    ...this.state.imgPathArray.slice(index + 1),
                ]
            }
            this.setState(newState)
        } else if (this.state.imgPathArray[index].visible) {
            const newState = {
                ...this.state, imgPathArray: [
                    ...this.state.imgPathArray.slice(0, index),
                    { ...this.state.imgPathArray[index], visible: false },
                    ...this.state.imgPathArray.slice(index + 1),
                ]
            }
            this.setState(newState)
        }
    }


    handleXmasMessage = () => {
        this.setState({
            ...this.state, showXmasMessage: false
        })
    }

    handleGo = () => {

        if (!this.state.showGoAlert) {
            this.setState({
                ...this.state, showGoAlert: true
            })

        } else {
            this.setState({
                ...this.state, showGoAlert: false
            })
        }
    }

    handleLaunch = () => {
        this.props.calendarCompleteAC()
        db.fireCalendarComplete(this.props.user.id)
            .catch(function (error) {
                console.log("🔥 fireCalendarComplete error = " + error.message)
            });
    }

    urlPrefix = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/covers/"

    render() {
        // console.log("this.state from render = ", this.state);

        return (

            <div className="section-preview">

                <div className="section-content section-preview-content">

                    <div className="review-content-bkg "></div>
                    <h1 className="text-center"> {this.props.user.name}, are you ready? </h1>   

                    <p className="mb1">&gt; Check your preview out - click the boxes to see your images. Just scroll up to change anything, if it's good then ... </p>
                    
                    <div className="text-center">
                    
                    <Button onClick={this.handleGo} className="my-btn launch-btn">Launch Countdown Cal </Button>
                 
                    </div>
                    <div className="preview-flex-cont">

                        {this.state.showXmasMessage && <div onClick={this.handleXmasMessage} className="xmas-message">
                            <span className="the-message">{this.props.user.xmasMessage}</span>
                        </div>}



                        <div className="preview-cover" style={{ backgroundImage: `url(${ this.urlPrefix + this.props.user.coverUrl})` }}></div>

                        {this.state.imgPathArray.map((el, index) => {
                            return (

                                <div key={index} className="preview-item">

                                    {(!el.visible && el.dateIsGood) || (!el.visible && !el.dateIsGood) ? (<div className="preview-cal-number" onClick={() => { this.handleShowImg(index) }}> <p style={{ fontSize: "1.8rem" }}>{el.date}</p> </div>) : null}

                                    <div
                                        onClick={() => { this.handleShowImg(index) }}
                                        className={`preview-item-img ${el.visible && "show-preview-img hide-date"}`}
                                    >

                                        <img className="" src={`https://res.cloudinary.com/dcqi9fn2y/image/upload/w_300,h_300,c_fill/${el.path}`} alt="" />

                                    </div>
                                </div>
                            )



                        }
                        )}

                    </div>

                </div>


            

                    {this.state.showGoAlert
                        && <div className="goAlert">
                            <div className="goAlertText page-content">

                                <h2 className="text-center">Are you sure? once your calendar is launched you cannot go back <span role="img" aria-label="emoji">🙀</span> </h2>

                                <Button
                                    type="primary"
                                    size="large"
                                    className="my-btn hang-on-btn"
                                    onClick={this.handleGo}>Hang on... I'm going to double check</Button >

                                <Button
                                    type="primary"

                                    size="large"
                                    className="my-btn go-btn"
                                    onClick={this.handleLaunch}> Launch my countdown calendar</Button >
                                <br></br>


                            </div>
                        </div>}
                </div>

            


        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}


export default connect(mapStateToProps, { calendarCompleteAC })(withRouter(SectionPreview))