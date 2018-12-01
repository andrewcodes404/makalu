import React from 'react';
import { connect } from 'react-redux'
import { addCoverAC } from '../actions'
import { db } from '../firebase';
// import {Icon} from 'antd';

//style

// const urlStart = "https://res.cloudinary.com/dcqi9fn2y/image/upload/"

const globe = "aaron-burden-190447-unsplash.jpg";
const tree_whole = "arun-kuchibhotla-179756-unsplash.jpg";
const ornaments = "beatriz-perez-moya-513496-unsplash.jpg"
const tree_detail1 = "bruno-martins-433884-unsplash.jpg";
const santa_decoration = "caleb-woods-170974-unsplash.jpg";
const robin = "clever-visuals-481587-unsplash.jpg"; 
const book = "cris-dinoto-460411-unsplash.jpg";
const snowscene1 = "fabian-mardi-538249-unsplash.jpg";
const fancyCrave = "fancycrave-174017-unsplash.jpg"
const decorations2 = "freestocks-org-487547-unsplash.jpg"; 
const santa = "guilherme-stecanella-465088-unsplash.jpg"; 
const snowscene2 = "jasmin-schuler-479920-unsplash.jpg";
const reindeer = "jeremy-stenuit-636299-unsplash.jpg";
const abstract1 = "joel-filipe-201191-unsplash.jpg";
const decorations3 = "kelly-sikkema-168787-unsplash.jpg"; 
const street_decorations = "marina-khrapova-197934-unsplash.jpg"; 
const snatahats = "mel-poole-690014-unsplash.jpg";
const dog = "rhaul-v-alva-491530-unsplash.jpg";
const tree_detail2 = "rodion-kutsaev-55088-unsplash.jpg";
const cake_decorations = "tyler-delgado-497539-unsplash.jpg"; 

const urlSmall = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/covers-sml/"

const coverFilename = [
    globe,
    tree_whole,
    ornaments,
    tree_detail1,
    santa_decoration,
    robin,
    book,
    snowscene1,
    fancyCrave,
    decorations2,
    santa,
    snowscene2,
    reindeer,
    abstract1,
    decorations3,
    street_decorations,
    snatahats,
    dog,
    tree_detail2,
    cake_decorations,  ]

class SectionCoverPicker extends React.Component {

    handlePick = (url) => {
        this.props.addCoverAC(url)
        db.fireAddCoverUrl(this.props.user.id, url)
            .then(() => {

            })
            .catch(function (error) {
                console.log("fireAddCoverUrl: " + error.message)
            });
    }

    render() {
        return (

            <div className="section-cover">
                
                <div className="section-content section-cover-content">

                
                <p> 2) Now pick a cover image from the options below.{this.props.user.coverUrl ? <span className="tick"> &#10003;</span> : ""}</p>

                <div className="cover-flex-cont">

                    {coverFilename.map((el, index) => { 
                       
                        return (

                        <div key={index} className={`cover-item  ${this.props.user.coverUrl === el && "cover-highlight"}`}>

                            <div className="cover-item-img">
                                    <img className="cover-img" src={urlSmall + el} alt="" onClick={() => { this.handlePick(el) }} />
                            </div>


                        </div>
                    )}
                    )}
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

export default connect(mapStateToProps, { addCoverAC })(SectionCoverPicker)
