import React from 'react';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { logOutAC } from '../../actions'
import { Form, Icon, Input, Button, Modal } from 'antd';
const FormItem = Form.Item;

class Login extends React.Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            error: false,
            errorMessage: null,
            errorBtn: null,
            popUp: false,
            visible: false,
            authUser: null,
            topRightXinModalVisable: true
        };
    }

    
    componentDidMount() {
        //is user already loggedIn? and verified
        // if (this.props.user.loggedIn && this.props.user.emailVerified) {
        //     this.props.history.push('/build')
        // }
    }



    // HANDLE THE LOGIN FORM // HANDLE THE LOGIN FORM // HANDLE THE LOGIN FORM 
    // HANDLE THE LOGIN FORM // HANDLE THE LOGIN FORM // HANDLE THE LOGIN FORM 
    // HANDLE THE LOGIN FORM // HANDLE THE LOGIN FORM // HANDLE THE LOGIN FORM 


    handleSubmit = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (!err) {
                const email = values.emailLogin
                const password = values.passwordLogin

                auth.doSignInWithEmailAndPassword(email, password)
                    // 👇 this happens when the promise is fufilled ie login is successful
                    .then((authUser) => {
                        this.setState({ authUser })
                        // console.log('doSignInWithEmailAndPassword - the promise returns!')
                        // console.log("authUser from doSignIn... = ", authUser);
                        this.props.history.push('/')
                        
                        if (authUser.user.emailVerified) {
                            // console.log('you do get here 👏 in production');
                        }
                    })

                    // this is catching the errors
                    .catch(error => {

                        if (error) {
                            let errorMessage = null
                            let errorBtn = null
                            if (error.code === 'auth/user-not-found') {
                                errorMessage = `${values.emailLogin}  is not a registered account, try and register ✌️ `
                                errorBtn = "register"

                            } else if (error.code === 'auth/wrong-password' || 'auth/user-not-found') {
                                errorMessage = 'wrong username or password!!!!'
                                errorBtn = "close"
                            } else if (error.code === 'auth/user-disabled') {
                                errorMessage = 'account disabled please contact admin'
                                errorBtn = "close"
                            } else if (error.code){
                                console.log("error.code = ", error.code);
                            }
                            //turns on the error modal and set correct message
                            this.setState({
                                ...this.state,
                                error: true,
                                errorMessage: errorMessage,
                                errorBtn: errorBtn,
                                popUp: true,
                            })

                           
                        }
                    })

            }
        })
    }

    // WHEN THE LOGIN HAPPENS CHECK THE EMAIL IS VERIFIED 
    // WHEN THE LOGIN HAPPENS CHECK THE EMAIL IS VERIFIED
    // WHEN THE LOGIN HAPPENS CHECK THE EMAIL IS VERIFIED


    componentDidUpdate(prevProps) {

        // checking for a change in state ie/ when someone is logged in
        if (this.props.user.loggedIn !== prevProps.user.loggedIn) {

            //Email NOT verified
            if (this.props.user.loggedIn && !this.props.user.emailVerified) {

                // send out specific MODAL of email not verified
                this.setState({
                    ...this.state,
                    error: true,
                    errorMessage: "Hey dude nearly there, you just need to verify your email, check your inbox",
                    errorBtn: "notVerfied",
                    popUp: true,
                    topRightXinModalVisable: false
                })

                //LogOut from Redux State
                this.props.logOutAC()

                //IMP LogOut from FireBase 
                auth.doSignOut().then(() => {
                    // console.log('🔥fire signout done');
                }).catch((err) => {
                    console.log("err from 🔥fire signout = ", err);
                })

            }
            //it's good email ie verified on to the account page 👏
            else if (this.props.user.loggedIn && this.props.user.emailVerified) {
                // console.log('email is verified 👏 continue');
                // this.props.history.push('/build')
            }

        }
    }


    // MODALS  // MODALS  // MODALS// MODALS  // MODALS  // MODALS
    // MODALS  // MODALS  // MODALS// MODALS  // MODALS  // MODALS
    // MODALS  // MODALS  // MODALS// MODALS  // MODALS  // MODALS


    /// this is for the MOdals onCancel attr... will close the modal if you click anywhere on the page

    handleCloseModal = () => {
        if (this.state.errorBtn === "close") {
            this.setState({
                error: false,
                errorMessage: null,
                errorBtn: null,
                popUp: false,
                visible: false,
            });

        } else if (this.state.errorBtn === "register") {
            this.setState({
                error: false,
                errorMessage: null,
                errorBtn: null,
                popUp: false,
                visible: false,
            });
        }
        //HERE 👇 we don't want the  onCancel attr to do anything
        else if (this.state.errorBtn === "notVerfied") {
            return null
        }
    }

    handleRegister = () => {
        this.props.history.push('/register')
    }

    handleSendCloseModal = () => {
        // this.props.form.resetFields()
        this.setState({
            error: false,
            errorMessage: null,
            errorBtn: null,
            popUp: false,
            visible: false,
        });

    }

    handleSendEmail = () => {
       
        const authUser = this.state.authUser
        authUser.user.sendEmailVerification().then(() => {
    
            this.setState({
                error: false,
                errorMessage: null,
                errorBtn: null,
                popUp: false,
                visible: false,
                authUser: null,
                topRightXinModalVisable: true

            });

        }).catch(function (error) {
            // An error happened.
            console.log("verfication-email-send error : ", error);
        });

    }

    // this.props.form.resetFields()



//render() //render()//render() //render() //render() //render() //render() 
//render() //render()//render() //render() //render() //render() //render() 
//render() //render()//render() //render() //render() //render() //render() 

    render() {
        // console.log("this.state from login.js = ", this.state);

        const { getFieldDecorator } = this.props.form;

        let buttons = []
        if (this.state.errorBtn === "close") {
            buttons = [
                <Button key="close" onClick={this.handleCloseModal}>close</Button>
            ]
        } else if (this.state.errorBtn === "register") {
            buttons = [
                <Button key="close" onClick={this.handleCloseModal}>close</Button>,
                <Button key="register" onClick={this.handleRegister}>register</Button>
            ]
        }
        else if (this.state.errorBtn === "notVerfied") {
            buttons = [
                <Button key="ok" onClick={this.handleSendEmail}>send verify again</Button>,
                <Button key="err4" onClick={this.handleSendCloseModal}>sign in</Button>
            ]

        }


        return (

            <div>
            

                <Modal
                    visible={this.state.popUp}
                    closable={this.state.topRightXinModalVisable}
                    onCancel={this.handleCloseModal}
                    footer={[buttons]}
                >{this.state.errorMessage} </Modal>

                
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h2>Log in</h2>
                    <FormItem className="form-item">
                        {getFieldDecorator('emailLogin', {
                            rules: [{
                                type: 'email', message: 'The input is not valid E-mail!',
                            }, { required: true, message: 'Please input your E-mail!', }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Email" />
                        )}
                    </FormItem>



                    <FormItem className="form-item">
                        {getFieldDecorator('passwordLogin', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>


                    <FormItem >
                        <div className="form-flex-bottom">
                        <Link className="router-link" to="/forgot">Forgot password</Link>

                        <Button className="my-btn" type="primary" htmlType="submit" >Log in</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>

        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

const WrappedLogin = Form.create()(Login);

export default connect(mapStateToProps, { logOutAC })(WrappedLogin)