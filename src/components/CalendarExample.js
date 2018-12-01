import React from 'react';
import { db } from '../firebase';
import { withRouter, Link } from 'react-router-dom'

// style
import { Icon } from 'antd'
import logo from '../images/SVG/cc_logo.svg'
///vars for time
const now = new Date();
// const year = now.getFullYear()
// const month = now.getMonth() + 1
// const day = now.getDate()
const hour = now.getHours()

let theDate = 20181208
// if (process.env.NODE_ENV === 'production') {
//     theDate = ("" + year + month + day)
// } else {
//     theDate = 20181208
// }


class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imgPathArray: [],
            lightboxVisible: false,
            lightboxPath: "",
            isAuthenticating: true,
            username: "",
            calId: "",
            showMessage: true,
            calExists: false
        }
    }


    componentDidMount() {

        // get id from url parameter     
        const calId = this.props.match.params.id


        db.getExampleImagesForCalender(calId).then((snapshot) => {

            this.setState({
                ...this.state, calExists: true
            })
            console.log("snapshot = ", snapshot);
            // redirect to 404 if the uid is getting no result    
            if (!snapshot.val()) {
                console.log('the snap is null');
                this.props.history.push('/notfound')
                return null
            }

            console.log("snapshot.val() = ", snapshot.val());
            let fireImgArray = []
            const snap = snapshot.val()
            console.log("snap = ", snap);
            const imagesObj = snap.images

            console.log("snap = ", snap);
            const coverPath = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/covers/" + snap.coverUrl

            this.setState({
                coverPath,
                isAuthenticating: false,
                username: snap.username,
                message: snap.xmasMessage,
                calId
            })


            Object.keys(imagesObj).map((key) => {
                const objectWithKeyInit = imagesObj[key]
                objectWithKeyInit.firebaseKey = key
                fireImgArray.push(objectWithKeyInit)
                return fireImgArray
            })

            return fireImgArray

        }).then((fireImgArray) => {

            ///firebase once always returns a snap shot even if empty
            // so let's stop it here

            // TODO: this needs tidy up too many .then()
            // get this then in its own function and run it from here
            if (!fireImgArray) {
                return null
            }

            let imgPathArray = []
            fireImgArray.map((el, index) => {
                let dateIsGood = false
                let visible = false
                //We can use the index as a sort of date 
                //and check it against the real date
                if (hour >= index + 1 && theDate >= 20181201) {
                    dateIsGood = true
                }
                if (hour > index + 1 && theDate >= 20181201) {
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
            this.setState({ ...this.state, imgPathArray })
            console.log("this.state = ", this.state);

        }).catch(error => {
            console.log("cloud GET err = ", error);
        });
    }


    handleShowImg = (index) => {
        if (this.state.imgPathArray[index].dateIsGood) {
            //this drove me mad... if you want to UPDATE USE SLICE!!!!
            if (!this.state.imgPathArray[index].visible) {
                const newState = {
                    ...this.state, imgPathArray: [
                        ...this.state.imgPathArray.slice(0, index),
                        { ...this.state.imgPathArray[index], visible: true },
                        ...this.state.imgPathArray.slice(index + 1),
                    ]
                }
                this.setState(newState)
            }
        }



    }

    handleShowLightBox = (path, visible, dateGood) => {
        if (visible && dateGood) {
            this.setState({
                lightboxVisible: true,
                lightboxPath: path
            })
        }
    }

    handleCloseLightBox = () => {
        this.setState({
            lightboxVisible: false,
            lightboxPath: ""
        }
        )
    }

    removeMessage = () => {
        this.setState({
            showMessage: false
        })
    }


    render() {

        if (this.state.isAuthenticating) {
            return null
        } else {
            if (!this.state.calExists) {
                console.log('the snap is null');
                this.props.history.push('/notfound')
                return null
            } else {
                return (

                    <div>
                        <div className="cal-body">
                            <div className="example-page-message-top">
                                <p>Want your own countdown calendar? <span role="img" aria-label="emoji">👉</span>  <Link to="/">coutndowncals.com</Link></p>
                            </div>
                            {/* {process.env.NODE_ENV === 'production' && <Timer name={this.state.username} />} */}
                            {/* {theDate < 20181201 && <Timer name={this.state.username} calId={this.state.calId}/>} */}
        
        
                            {theDate >= 20181201 && this.state.showMessage
                                ? <div className="message-cont" onClick={this.removeMessage}>
                                    <div className="example-page-message-center">
                                        <div className="example-page-logo">
                                            <Link to="/">
                                                <img src={logo} alt="" />
                                            </Link>
                                        </div>
                                        <p>This is an example page, It's timed to hours not date, so if its 15:00 you can see all the boxes up to 15!</p>
                                        <p className="underline">Click anywhere on the page to have a look</p>
                                        <p>Why not make your own  personal online advent calendar, Share your best photos of 2018 with family and friends <Link to="/">coutndowncals.com</Link></p>
        
                                    </div>
                                </div>
                                : null}
        
        
        
                            <div className={`cal-container un-blur-me   ${this.state.showMessage && "blur-me"}`}>
        
                                <div className="cal-cover" style={{ backgroundImage: `url(${this.state.coverPath})` }}></div>
        
                                {this.state.imgPathArray.map((el, index) => {
        
                                    return (
        
                                        <div onClick={() => { this.handleShowLightBox(el.path, el.visible, el.dateIsGood) }} key={index} className={`cal-box ${el.visible && el.dateIsGood && "show-cal-img"}`}>
        
                                            <img src={`https://res.cloudinary.com/dcqi9fn2y/image/upload/w_300,h_300,c_fill/${el.path}`} alt="" />
        
                                            {(!el.visible && el.dateIsGood) || (!el.visible && !el.dateIsGood)
                                                ? (
                                                    <div className={`cal-number ${!el.visible && !el.dateIsGood && "bad-number"} `} onClick={() => { this.handleShowImg(index) }}>
                                                        <p style={{
        
                                                            fontSize: "2rem",
                                                            fontWeight: "400"
                                                        }}>{el.date}</p>
                                                    </div>)
        
                                                : null}
        
                                        </div>
                                    )
                                }
                                )}
        
                            </div>
        
        
                            {/* The LightBox */}
        
                            {this.state.lightboxVisible && (
                                <div onClick={this.handleCloseLightBox} className="lightbox-cont">
                                    <div className="lightbox-img">
                                        <div className="lightbox-close-btn">
                                            <Icon type="close-circle" theme="outlined" />
                                        </div>
        
                                        <img src={`https://res.cloudinary.com/dcqi9fn2y/image/upload/${this.state.lightboxPath}`} alt="" />
        
                                    </div>
                                </div>
                            )}
        
                        </div>
                    </div>
                );

            }
        }


       
    }
}




export default withRouter(Calendar)