import React from 'react';

import { db } from '../../firebase';
import { auth } from '../../firebase';
// import { connect } from 'react-redux'

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

    //1 doCreateUserWithEmailAndPassword
    //2 update profiile with username
    //3 db.doCreateUser(authUser.user.uid, username, email)
    //4 authUser.user.sendEmailVerification()

    registerUser = (values) => {

        const email = values.email;
        const password = values.password;

        // auth.fireCreateUserWithEmailAndPassword(email, password)
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                console.log('user created ✔️');
                this.updateUserName(authUser)
            })
            .catch( (error) => {
                console.log("🔥 fireCreateUserWithEmailAndPassword : ", error);
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

            </div>
        );
    }
}

const RegistrationForm = Form.create()(Register);
export default RegistrationForm