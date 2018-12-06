export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const ADD_IMAGE = 'ADD_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'
export const ADD_COVER = 'ADD_COVER'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const CALENDAR_COMPLETE = 'CALENDAR_COMPLETE'

export function logInAC(snapshot, emailVerified) {
    
    //firebase doesn't make arrays, it makes objects
    //for ease of use we want the users img urls in an array
    let imagesArray = [];

    //check if there are images?
    if (snapshot.images) {

        const imagesUrlsObject = snapshot.images

        //uses Object.keys to return an array of the obj props
        Object.keys(imagesUrlsObject).map((key) => {

            // use [bracket] notation to pick ut a singular value
            const objectWithKeyInit = imagesUrlsObject[key]
            // console.log("objectWithKeyInit = ", objectWithKeyInit);
            
            //add the key into the object as 'firebadeKey' this will be usefill later on
            objectWithKeyInit.firebaseKey = key
  
            // push each object into the array
            imagesArray.push(objectWithKeyInit)
            return imagesArray
        })
    }


    //make a data object to use in Redux
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
    //
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

