import React from 'react';

class SectionChecklist extends React.Component {



    itclicked = () => {
        console.log('it clicked');

    }
    render() {
        return (


            <div className="section-checklist">

                <div className="section-content section-checklist-content">

                    <div className="checklist-bkg"></div>

                    <div>
                        <h2>Scroll back up to complete these steps and your preview will show here...</h2>

                        {this.props.imgCountComplete
                            ? (<p>Upload images <span className="tick"> &#10003;</span></p>)
                            : (<div>
                                <p>Upload images <span className="cross">&#10008;
                                </span><span onClick={this.props.scrollToUpload} className="check-message">You need to upload {this.props.imgLeft} more images</span> </p>

                            </div>)}


                        {this.props.coverUrl
                            ? (<p>Choose a cover <span className="tick"> &#10003;</span></p>)
                            : (<div>
                                <p>Choose a cover <span className="cross">&#10008;</span><span onClick={this.props.scrollToCover} className="check-message">Please pick a cover image for the calendar</span></p>
                            </div>)}

                        {this.props.xmasMessage
                            ? (<p>Write a message <span className="tick"> &#10003;</span></p>)
                            : (<div>

                                <p>Write a message <span className="cross">&#10008;</span> <span onClick={this.props.scrollToMessage} className="check-message"> Send some holiday cheer, write a message</span></p>

                            </div>)}
                    </div>
                  
                </div>
            </div>

        );
    }
}

export default SectionChecklist