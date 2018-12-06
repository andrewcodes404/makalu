import React from 'react';
import { connect } from 'react-redux'
import { addImageAC, deleteImageAC } from '../actions'
import { db } from '../firebase';

//style
import { Icon } from 'antd'

class SectionUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pw: '',
            admin: false
        };
    }

    handlePwChange = (event) => {
        // console.log("event.target.value : ", event.target.value);
        this.setState({ pw: event.target.value })
        // console.log("this.state.name = ", this.state.name);
    }

    handlePwSubmit = () => {
        if (this.state.pw === process.env.REACT_APP_ADMIN) {
            this.setState({ admin: true })
        }
    }

    ///add examples name to state
    handleChange = (event) => {
        // console.log("event.target.value : ", event.target.value);
        this.setState({ name: event.target.value })
        // console.log("this.state.name = ", this.state.name);
    }

    uploadWidget = (name) => {

        const cloudFolder = `countdown_assets/examples/${name}`

        window.cloudinary.openUploadWidget(
            {
                cloud_name: 'dcqi9fn2y',
                upload_preset: "countdown",
                maxImageWidth: 2400,
                maxImageHeight: 2400,
                // maxFiles: imgLeft,
                tags: [name, 'countdown'],
                folder: cloudFolder,
                sources: ['local', 'facebook', 'instagram'],
                text: {
                    en: {
                        "queue": {
                            // "title": "Upload Queue",
                            "title": "Upload Finished",
                            "title_uploading_with_counter": "Uploading {{num}} Assets",
                            "title_uploading": "Uploading Assets",
                            "mini_title": "Uploaded",
                            "mini_title_uploading": "Uploading",
                            "show_completed": "Show completed",
                            "retry_failed": "Retry failed",
                            "abort_all": "Abort all",
                            "upload_more": "Upload More",
                            "more": "More",
                            "mini_upload_count": "{{num}} Uploaded",
                            "mini_failed": "{{num}} Failed",
                            "statuses": {
                                "uploading": "Uploading...",
                                "error": "Error",
                                "uploaded": "Done",
                                "aborted": "Aborted"
                            }
                        },
                        "notifications": {
                            "general_error": "An error has occurred",
                            "general_prompt": "Are you sure?",
                            // "limit_reached": "No more files can be selected",
                            // "limit_reached": `You have a maximum of ${imgLeft} images left`,
                            "invalid_add_url": "Added URL must be valid",
                            "invalid_public_id": "Public ID cannot contain \\,?,&,#,%,<,>",
                            "no_new_files": "File(s) have already been uploaded"
                        },
                    }
                }

            },
            (error, result) => {
                console.log(result);

                if (result && result.event === "success") {

                    const name = this.state.name
                    const url = result.info.secure_url
                    const filename = result.info.original_filename
                    const created_at = result.info.created_at
                    const path = result.info.path

                    db.addNewExampleImages(name, url, filename, created_at, path)
                        .then(() => {

                            const imgOnb = { name, url, filename, created_at, path }
                            this.props.addImageAC(imgOnb)
                        })
                        .catch(error => {
                            console.log("fireUploadUrl = ", error);
                        });
                }

                if (error) {
                    console.log("error from cloudinary = ", error);
                }

            }
        );
    }


    render() {

        console.log("this.state = ", this.state);
        console.log("this.props.user = ", this.props.user);
        if (this.props.user.isAuthenticating) return null;
        return (
            <div className="example-build">

                {!this.state.admin && <div className="example-pw">
                    <label>pw : </label>
                    <input type="text" value={this.state.pw} onChange={this.handlePwChange} />
                    <button onClick={this.handlePwSubmit}>submit</button>
                </div>}

                {this.state.admin &&  <div>
                    <div className="mb3">
                        <label>enter cal name : </label>
                        <input type="text" value={this.state.name} onChange={this.handleChange} />
                    </div>
                    <div className="section-content section-upload-content">
                        <div className="section-upload-content-bkg"></div>
                        <div>
                            <div>
                                <div className="upload-btn"
                                    onClick={() => { this.uploadWidget(this.state.name) }}>
                                    <h2>upload <Icon type="upload" theme="outlined" /></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        userImages: state.user.userImages
    }
}

export default connect(mapStateToProps, { addImageAC, deleteImageAC })(SectionUpload)