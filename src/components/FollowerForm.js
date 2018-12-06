import React from 'react';
import { Form, Icon, Input, Button, Modal } from 'antd';
import { db } from '../firebase';

const FormItem = Form.Item;

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

class FollowerForm extends React.Component {


    handleSubmit = (e) => {
        
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
            
                this.props.form.resetFields()
                const email = values.email
                const name = values.name
                const calId = this.props.calId
                const calCreator = this.props.calCreator

                //check to see if email already follows this cal
                db.fireCheckFollowers(calId).then((snapshot) => {
                    const snap = snapshot.val()
                    // console.log("snap = ", snap);                                  
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
                console.log('added to followers list')
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

        console.log("FolowerForm.js this.props = ", this.props);
        
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="follower-form">
                
                    <div className="flex-one"></div>

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
                        <p> Want your own countdown calendar? It's so easy <a href="https://countdowncals.com/">CountdownCals.com</a> </p>


                </div>
          
        );
    }
}
const WrappedFollowerForm = Form.create()(FollowerForm);
export default WrappedFollowerForm