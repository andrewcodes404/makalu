import React from 'react';
import { connect } from 'react-redux'
import { addImageAC, deleteImageAC } from '../actions'
import { db } from '../firebase';
//style
import { Icon, Modal } from 'antd'

class SectionUpload extends React.Component {

    uploadWidget = (name, uuid, imgLeft) => {

        const cloudFolder = process.env.NODE_ENV === 'production'
            ? `countdownProd/${name + "_" + uuid}`
            : `countdownDev/${name + "_" + uuid}`

        window.cloudinary.openUploadWidget(
            {
                cloud_name: 'dcqi9fn2y',
                upload_preset: "countdown",
                maxImageWidth: 2400,
                maxImageHeight: 2400,
                maxFiles: imgLeft,
                tags: [name, uuid, 'countdown'],
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
                            "limit_reached": `You have a maximum of ${imgLeft} images left`,
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

                    const url = result.info.secure_url
                    const filename = result.info.original_filename
                    const created_at = result.info.created_at
                    const path = result.info.path

                    db.fireUploadUrl(uuid, url, filename, created_at, path)
                        .then(() => {

                            const imgOnb = { uuid, url, filename, created_at, path }
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

    //Delete image Modal -- //Delete image Modal
    //Delete image Modal -- //Delete image Modal

    modalDeleteImg = (uuid, firebaseKey, index) => {

        Modal.error({
            title: 'Are you sure? delete this image?',

            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteImage()
            },
            onCancel() {
                console.log('Cancel');
            },
        });

        const deleteImage = () => {
            this.handleDeleteImg(uuid, firebaseKey, index);
        }
    }

    //Delete image functon -- //Delete image functon
    //Delete image functon -- //Delete image functon

    handleDeleteImg = (uuid, firebaseKey, index) => {

        db.fireDeleteURL(uuid, firebaseKey)
            .then(() => {
                console.log("Remove succeeded.")
                this.props.deleteImageAC(index)
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });

        // TODO: need to delete the image from cloudinary
        // cloudinary.v2.uploader.destroy(public_id, options, callback);

    }

    render() {

        let name = this.props.user.name

        //ARGH!! ☠️ remove white space and non alphaNumeric from username
        // was breaking the cloudinary create-folder
        if (name){
            name = name.replace(/\s+/g, '');
            name = name.replace(/\W/g, '')
        }        
        
        const uuid = this.props.user.id
        const images = this.props.userImages
        const imgCountNeeded = 24
        const imgCount = this.props.userImages.length
        let imgCountComplete
        if (imgCount >= imgCountNeeded) {
            imgCountComplete = true
        } else { imgCountComplete = false }


        const imgLeft = imgCountNeeded - imgCount
        if (this.props.user.isAuthenticating) return null;
        return (
            <div className="section-upload">

                <Icon type="scissor" className="scissor-upload" />

                <div className="section-content section-upload-content">

                    <div className="section-upload-content-bkg"></div>

                    <div>

                        <h2 className="welcome"><span role="img" aria-label="emoji">🎅</span> Ho Ho Ho... it's time to start your countdown calendar.</h2>


                        {imgCountComplete
                            ? <div>
                                <p>Image upload complete
                                    <span className="tick"> &#10003;</span>
                                </p>
                            </div>
                            : (
                                <div>
                                    <p> 1)  Upload 24 images from your folders, facebook or instagram (press the upload button to begin).</p>
                                    <div className="upload-btn"
                                        onClick={() => { this.uploadWidget(name, uuid, imgLeft) }}>

                                        <h2>upload <Icon type="upload" theme="outlined" /></h2>
                                    </div>

                                </div>

                            )}



                        <div className="upload-flex-cont">
                            {[...Array(24)].map((e, i) => {
                                return (
                                    <div className="upload-flexitem" key={i}>

                                        {images.length > i
                                            ? (<div className="build-box-icons">
                                                <span className="del-btn"><Icon onClick={() => { this.modalDeleteImg(uuid, images[i].firebaseKey, i) }} type="delete" theme="outlined" className="thumb-icons" /></span>
                                            </div>)
                                            : ""
                                        }


                                        <div className="upload-imgcont">
                                            {images.length > i
                                                ? (<img className="" src={"https://res.cloudinary.com/dcqi9fn2y/image/upload/c_scale,w_300/" + images[i].path} alt="" />)
                                                : (<p className="date">{i + 1}</p>)}
                                        </div>
                                    </div>
                                )
                            })
                            }

                        </div>

                    </div>
                </div>
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