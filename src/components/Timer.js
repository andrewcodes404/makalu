import React from 'react';
import { Form, Icon, Input, Button, Modal } from 'antd';
import { db } from '../firebase';
// the countdown
import Countdown from 'react-countdown-now';

const FormItem = Form.Item;

let timerTarget = 'Sat, 01 Dec 2018 00:00:00'
if (process.env.NODE_ENV === 'production') {
    timerTarget = 'Sat, 01 Dec 2018 00:00:00'
}
// function hasErrors(fieldsError) {
//     return Object.keys(fieldsError).some(field => fieldsError[field]);
// }


function modalEmailAlreadyFollowing() {
    const modal = Modal.warning({
        title: 'You are already following this calendar',
    });
    setTimeout(() => modal.destroy(), 5000);
}

function modalEmailSent(name, email) {
    const modal = Modal.success({
        title: `Thanks ${name}, this calendar link has been sent to ${email} `,
    });
    setTimeout(() => modal.destroy(), 5000);
}

class Timer extends React.Component {

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
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
        console.log("this.props = ", this.props);

    }

    handleSubmit = (e) => {
       
        e.preventDefault();
        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.form.resetFields()
                const email = values.email
                const name = values.name
                const calId = this.props.calId
                const calCreator = this.props.name

                //check to see if email already follows this cal
                db.fireCheckFollowers(calId).then((snapshot) => {


                    const snap = snapshot.val()
                    console.log("snap = ", snap);
                    
                
                    let match = null

                    if (snap) {
                        Object.keys(snap).map((key) => {
                        
                            if (snap[key].email === email) {
                                console.log('matches', snap[key].email);
                                match = true
                            } else {
                                console.log('doesnt match', snap[key].email);
                            }
                            return match
                          
                        })                    
                    } else {
                        match = false
                    }
                    


                    if (match){
                        console.log('match is true');
                        modalEmailAlreadyFollowing()
                       
                    } else {
                        modalEmailSent(name, email)
                        this.addToFollowers(email, calId, name, calCreator)
                        // modal
                        
                    }
                  
                })
            }
        });
    }



    addToFollowers = (email, calId, name, calCreator) => {
        db.fireAddReminderEmail(email, calId, name, calCreator)
            .then(() => {
                console.log('added to reminder-list')
            }, (error) => {
                console.log('🔥 error at  fireAddReminderEmail()', error);
            })

    }


    countdownRender = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return null
        } else {
            // Render a countdown
            return (
                <h2 className="timer">{days}<span className="">d</span>:{hours}h:{minutes}m:<div className="secs">{seconds}</div>s</h2>

            );
        }
    };


    render() {

        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="timer-bkg">
                    <div className="flex-one"></div>
                    <h1>Countdown to {this.props.name}'s advent calendar</h1>


                    <Countdown date={timerTarget} renderer={this.countdownRender} />

                    <div className="reminder-box">
                        <h2>Keep up with {this.props.name} </h2>
                        <p>Get this calendar link &amp; reminder sent to your inbox?</p>

                        <Form onSubmit={this.handleSubmit} className="form-reminder">


                            <FormItem className="form-reminder-item">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Please input your name' }],
                                })(
                                    <Input prefix={<Icon type="smile" style={{ color: 'grey' }} />} type="text" placeholder="name" />
                                )}
                            </FormItem>

                            <FormItem className="form-reminder-item">
                                {getFieldDecorator('email', {
                                    rules: [{
                                        type: 'email', message: 'The input is not valid email',
                                    }, { required: true, message: 'Please input your email', }],
                                })(
                                    <Input prefix={<Icon type="mail" style={{ color: 'grey' }} />} type="text" placeholder="email" />
                                )}
                            </FormItem>

                            <FormItem className="form-reminder-item">
                                <Button className="my-btn" type="primary" htmlType="submit" >Submit</Button>
                            </FormItem>
                        </Form>

                    </div>
                    <div className="flex-one"></div>
                    <small className="timer-message"> Want your own countdown calendar? It's so easy <span role="img" aria-label="emoji">👉</span> <a href="https://countdowncals.com/">CountdownCals.com</a> </small>
                </div>
            </div>
        );
    }
}
const WrappedTimer = Form.create()(Timer);
export default WrappedTimer