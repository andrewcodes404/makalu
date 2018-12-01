// import { db } from '../firebase';
// import uuidv1 from "uuid/v1"

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const ADD_IMAGE = 'ADD_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'
export const ADD_COVER = 'ADD_COVER'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const CALENDAR_COMPLETE = 'CALENDAR_COMPLETE'

export function logInAC(snapshot, emailVerified) {


    
    let imagesArray = [];
    if (snapshot.images) {
    
        const contentObj = snapshot.images
        Object.keys(contentObj).map((key) => {

            const objectWithKeyInit = contentObj[key]
            objectWithKeyInit.firebaseKey = key

            imagesArray.push(objectWithKeyInit)
            return imagesArray
        })
    }

    //make data ob with images array
    const data = {
        id: snapshot.id,
        name: snapshot.username,
        emailVerified: emailVerified,
        email: snapshot.email,
        userImages: imagesArray,
        coverUrl: snapshot.coverUrl,
        xmasMessage: snapshot.xmasMessage,       
        calendarComplete: snapshot.calendarComplete
    }

    return {
        type: LOGIN,
        payload: data
    }
}

export function logOutAC() {
    return {
        type: LOGOUT
    }
}

export function addImageAC(url) {
    return {
        type: ADD_IMAGE,
        payload: url
    }
}

export function deleteImageAC(url) {
    return {
        type: DELETE_IMAGE,
        payload: url
    }
}

export function addCoverAC(url) {
    return {
        type: ADD_COVER,
        payload: url
    }
}

export function addXmasMessageAC(theMessage) {
    return {
        type: ADD_MESSAGE,
        payload: theMessage
    }
}

export function calendarCompleteAC() {
    return {
        type: CALENDAR_COMPLETE
    }
}

