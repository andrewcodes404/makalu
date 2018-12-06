import React from 'react';
import { connect } from 'react-redux'
//firebase
import { auth } from '../../firebase/firebase';

import Navigation from "../Navigation";

//style
import { Form, Icon, Input, Button, Modal, notification } from 'antd';
const FormItem = Form.Item;


class Forgot extends React.Component {


    constructor(props) {
        super(props);
        // Don't call this.setState() here!

        this.state = {
            error: false,
            errorMessage: "",
            popUp: false
        };
    }

    componentDidMount() {
        //is user already loggedIn? and verified
        if (this.props.user.loggedIn && this.props.user.emailVerified) {
            this.props.history.push('/account')
        }
    }

    // For the error popup modal
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.history.push('/register')
    }

    handleCancel = () => {
        this.setState({
            popUp: false,
        });
    }

    // For the notification email has been sent

    openNotification = () => {
        notification.open({
            message: 'Reset password email sent',
            description: 'check your filters and spam',
            duration: 3,
        });
    };

    // for the Form submit
    handleSubmit = (e) => {

        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {

                const actionCodeSettings = {
                    url: 'https://countdowncals.com',
                };

                const email = values.email
                auth.sendPasswordResetEmail(email, actionCodeSettings)
                    .then(() => {
                        // this.props.history.push('/')
                        console.log('the promise returns!')
                        this.openNotification()
                        this.props.history.push('/')
                    })
                    .catch(error => {

                        if (error) {
                            if (error.code === 'auth/user-not-found') {
                                this.setState({
                                    error: true,
                                    errorMessage: `${values.email}  is not a registered account, try and register ✌️`,
                                    popUp: true
                                })
                            }
                        }
                    })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (

            <div>

                <Navigation scrollToLogin={this.scrollToLogin} />


                <div className="page-content">
                    <Form onSubmit={this.handleSubmit} className="forgot-form">
                        <h3>Enter your email and we will send you a password reset</h3>

                        <Modal
                            visible={this.state.popUp}
                            onOk={this.handleOk}
                            okText="register"
                            onCancel={this.handleCancel}
                        >
                            {this.state.errorMessage}
                        </Modal>

                        <FormItem>
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

                        <Button type="primary" htmlType="submit" className="login-form-button">submit</Button>
                    </Form>
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

const WrappedForgot = Form.create()(Forgot);
export default connect(mapStateToProps)(WrappedForgot)