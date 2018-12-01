import React from 'react';
import { Form, Input, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { db } from '../firebase';
import { connect } from 'react-redux'
import { addXmasMessageAC } from '../actions'
import { Icon } from 'antd'



class SectionMessage extends React.Component {

    handleSubmit = (e) => {

        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {

                this.props.addXmasMessageAC(values.xmasMessage)
                db.fireAddXmasMessage(this.props.userId, values.xmasMessage)
                    .then(() => {
                        this.props.scrollToPreview()
                    })
                    .catch(function (error) {
                        console.log("fireAddCoverUrl: " + error.message)
                    });
            }
        });

    }



    render() {
        const { TextArea } = Input;
        const { getFieldDecorator } = this.props.form;

        return (

            <div className="section-message">
                <Icon type="scissor" className="scissor-message" />
              
                <div className="text-area-cont">

                    <div className="section-content">
                        <p>3) Add a festive message (100 characters max).</p>


                        <Form onSubmit={this.handleSubmit} className="">

                            <FormItem id="basic">
                                {getFieldDecorator('xmasMessage', {
                                    rules: [{ required: true, message: 'Please enter a message dude...' }],

                                })(
                                    <TextArea rows={3} placeholder={`Happy Holidays... from ${this.props.username}`} maxLength="100" />
                                )}

                            </FormItem>

                            <Button className="form-btn" type="primary" htmlType="submit" >Enter</Button>
                        </Form>
                    </div>


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



const WrappedSectionMessage = Form.create(
    {
        mapPropsToFields: (props) => ({ "xmasMessage": Form.createFormField({ value: props.user.xmasMessage }) })
    }


)(SectionMessage);

export default connect(mapStateToProps, { addXmasMessageAC })(WrappedSectionMessage)


