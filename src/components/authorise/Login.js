import React from 'react';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Modal } from 'antd';
const FormItem = Form.Item;


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
            verifyVisible: false
        }
    }

    errorModal(errorMessage) {
        Modal.error({
            title: errorMessage,
            onOk: this.props.form.resetFields()
        });
    }

    verifyModalHandleOk = () => {
        this.setState({
            verifyVisible: false,
        });
    }

    verifyModalHandleSendEmail = () => {
        this.setState({
            verifyVisible: false,
        });
      
        const authUser = this.state.authUser
        authUser.user.sendEmailVerification().then(() => {
            this.setState({authUser : null})
        }).catch(function (error) {
            console.log("verfication-email-send error : ", error);
        });
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const email = values.emailLogin
                const password = values.passwordLogin

                auth.signInWithEmailAndPassword(email, password)
                    .then((authUser) => {
                        if (!authUser.user.emailVerified) {
                            
                            this.setState({
                                authUser,
                                verifyVisible: true,
                            });
                        }
                    })
                    .catch(error => {
                        if (error) {
                            if (error.code === 'auth/user-not-found') {
                                this.errorModal(`${values.emailLogin}  is not a registered account, try and register ✌️ `)
                            } else if (error.code === 'auth/wrong-password' || 'auth/user-not-found') {
                                this.errorModal('wrong username or password!!!!')
                            } else if (error.code === 'auth/user-disabled') {
                                this.errorModal('account disabled please contact admin')
                            } else if (error.code) {
                                console.log("error.code = ", error.code);
                            }
                        }
                    })
            }
        })
    }

    render() {
        console.log("from Login this.state = ", this.state);

        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Modal
                    message="Hey dude nearly there, you just need to verify your email, check your inbox"
                    visible={this.state.verifyVisible}
                    onOk={this.verifyModalHandleOk}
                    cancelText="send verification email again"
                    onCancel={this.verifyModalHandleSendEmail}
                >
                    <p>Hey dude nearly there, you just need to verify your email, check your inbox</p>
                </Modal>

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

const LoginForm = Form.create()(Login);
export default LoginForm