import React from 'react';

import { auth, db } from '../../firebase';
import { connect } from 'react-redux'

//style
import { Form, Input, Icon, Checkbox, Button, Modal } from 'antd';
const FormItem = Form.Item;

function modalEmailSent() {
    const modal = Modal.success({
        title: 'You\'re nearly there, you just need to verify your email, check your inbox',
    });
    setTimeout(() => modal.destroy(), 10000);
}

function modalEmailAlreadyRegistered() {
    const modal = Modal.warning({
        title: 'Looks like that email is already registered with us, try logging in',
    });
    setTimeout(() => modal.destroy(), 5000);
}

class Register extends React.Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!

        this.state = {
            confirmDirty: false,
            username: ""
        };
    }

    componentDidMount() {
        //is user already loggedIn? and verified
        // if (this.props.user.loggedIn && this.props.user.emailVerified) {
        //     this.props.history.push('/build')
        // }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        // if (this.props.user.loggedIn !== prevProps.user.loggedIn) {
        //     this.props.history.push('/build')
        // }
    }

    // registerUser = (values) => {

    //     console.log(' no error reisterUser() running 🏃‍♂️');

    //     const email = values.email
    //     const password = values.password
    //     const username = values.username.substr(0, 1).toUpperCase() + values.username.substr(1);


    //     auth.doCreateUserWithEmailAndPassword(email, password)
    //         .then(authUser => {
    //             console.log(' no error handleSubmit() running 🏃‍♂️');
    //             this.props.form.resetFields()
    //             db.doCreateUser(authUser.user.uid, username, email)

    //             authUser.user.updateProfile({
    //                 displayName: values.username,
    //             }).then(function () {
    //                 // Update Profile
    //                 // console.log('display name updated sent')
    //                 authUser.user.sendEmailVerification().then(function () {
    //                     // Email sent.
    //                     console.log('email verification sent sent');

    //                 }).catch(function (error) {
    //                     // An error happened.
    //                     console.log("email error : ", error);
    //                 });
    //             }).catch(function (error) {
    //                 // An error happened.
    //                 console.log("update user error : ", error);
    //             });

    //         }).catch(error => {
    //             console.log("error from doCreateUserWithEmailAndPassword = ", error);
    //         })
    // }

    //1 doCreateUserWithEmailAndPassword
    //2 update profiile with username
    //3 authUser.user.sendEmailVerification()
    //4 db.doCreateUser(authUser.user.uid, username, email)


    registerUser = (values) => {

        const email = values.email;
        const password = values.password;

        auth.doCreateUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                console.log('user created ✔️');
                this.updateUserName(authUser)
            })
            .catch( (error) => {
                // An error happened.
                console.log("🔥 CreateUserWithEmailAndPassword : ", error);
                if (error.code === "auth/email-already-in-use") {
                    modalEmailAlreadyRegistered()
                    //reset form
                    this.props.form.resetFields()
                }
            });
    }

    updateUserName = (authUser) => {

        authUser.user.updateProfile({
            displayName: this.state.username,
        }).then(() => {
            // Profile updated successfully
            console.log('user name updated ✔️');
            //send verification email
            this.sendVerEmail(authUser)

        }, function (error) {
            // An error happened.
            console.log('🔥 error at  user.updateProfile()', error);
        });

    }

    actionCodeSettings = {
        url: 'https://countdowncals.com',
    };

    sendVerEmail = (authUser) => {

        db.addUserToDb(authUser.user.uid, authUser.user.displayName, authUser.user.email)
            .then(() => {
                // Verification email sent.
                console.log('user added to db ✔️');

                //reset form
                this.props.form.resetFields()


            }, function (error) {
                // An error happened.
                console.log('🔥 error at  addUserToDb()', error);
            });

        authUser.user.sendEmailVerification(this.actionCodeSettings)
            .then(() => {

                // Verification email sent.
                console.log('verification email sent. ✔️');
                modalEmailSent()
            }, function (error) {
                // An error happened.
                console.log('🔥 error at  user.sendEmailVerification()', error);
            });
    }

    // addUserToDb = (authUser) => {

    //     const id = authUser.uid
    //     const displayName = authUser.displayName
    //     const email = authUser.email

    //     console.log("authUser = ", authUser);
    //     console.log("id = ", id);

    //     db.addUserToDb(authUser.uid, authUser.displayName, authUser.email)

    //         .then(function () {
    //             // Verification email sent.
    //             console.log('user added to db ✔️');

    //             //reset form
    //             this.props.form.resetFields()

    //             //user will log out automatically if email not verified

    //         }, function (error) {
    //             // An error happened.
    //             console.log('🔥 error at  addUserToDb()', error);
    //         });
    // }



    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const username = values.username.substr(0, 1).toUpperCase() + values.username.substr(1);
                this.setState({ username })
                // console.log('Received values of form: ', values);
                this.registerUser(values)
            }
        });
    }


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }


    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                
                <Form onSubmit={this.handleSubmit} className="registration-form">

                    <h2>Sign Up</h2>
                    <FormItem className="form-item">
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: 'The input is not valid E-mail!',
                            }, {
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Email" />
                        )}
                    </FormItem>

                    <FormItem className="form-item">
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input a name', whitespace: true }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Name" />
                        )}
                    </FormItem>


                    <FormItem className="form-item" >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: 'Please input your password!',
                            }, {
                                validator: this.validateToNextPassword,
                            }, {
                                min: 6
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>

                    <FormItem className="form-item">
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: 'Please confirm your password!',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Repeat Password" />
                        )}
                    </FormItem>

                    <FormItem className="form-item">

                        {getFieldDecorator('agreement', {
                            rules: [{
                                required: true, message: 'Confirm you have read the terms &amp; conditions',
                            }],
                            valuePropName: 'checked',
                        })(
                            <Checkbox className="terms">I have read the <a href="https://countdowncals.com/terms" target="_blank" rel="noopener noreferrer" >terms &amp; conditions</a></Checkbox>
                        )}

                    </FormItem>

                    <div className="reg-form-button">
                        <Button className="my-btn" type="primary" htmlType="submit">Register</Button>
                    </div>



                </Form>

                {/* <Button onClick={modalEmailSent}>Click Me</Button> */}
            </div>
        );
    }
}

const WrappedRegistrationForm = Form.create()(Register);

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(WrappedRegistrationForm)