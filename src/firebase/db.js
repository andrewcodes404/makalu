import { db } from './firebase';

///SET//////SET//////SET//////SET//////SET//////SET//////SET///
export const doCreateUser = (id, username, email) => {
    db.ref(`users/${id}`).set({
        id: id,
        username: username,
        email: email,
        userImages: [],
        coverPicked: false,
        coverUrl: "",
        xmasMessage: "",
        calendarComplete: false,
    });
}

export const addUserToDb = (id, username, email) => {
    return db.ref(`users/${id}`).set({
        id: id,
        username: username,
        email: email,
        userImages: [],
        coverPicked: false,
        coverUrl: "",
        xmasMessage: "",
        calendarComplete: false,
    });

}

///ONCE//////ONCE//////ONCE//////ONCE//////ONCE//////ONCE//////ONCE///

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetUser = (id) => db.ref(`users/${id}`).once('value');


//FOR WIGDIT
export const fireUploadUrl = (uuid, url, filename, created_at, path) => {
    var imageData = {
        path,
        filename,
        url,
        created_at
    };
    return db.ref(`users/${uuid}/images/`).push(imageData);
}

//DELETE UPLOADED IMAGE
export const fireDeleteURL = (uuid, firebaseKey) => {
    var imgRef = db.ref(`users/${uuid}/images/${firebaseKey}`);
    return imgRef.remove()
}

//ADD COVER IMG

export const fireAddCoverUrl = (uuid, url) => {
    var coverRef = db.ref(`users/${uuid}/coverUrl`);
    return coverRef.set(url)
}


// AddXmas Message
export const fireAddXmasMessage = (uuid, theMessage) => {
    var messageRef = db.ref(`users/${uuid}/xmasMessage`);
    return messageRef.set(theMessage)
}

// Add CalendarComplete
export const fireCalendarComplete = (uuid) => {
    var messageRef = db.ref(`users/${uuid}/calendarComplete`);
    return messageRef.set(true)
}




//For Calender.js

export const onceGetImagesForCalender = (id) => {
    var userCalRef = db.ref(`users/${id}`)
    return userCalRef.once('value');
} 

//// REMINDER LIST --- //// REMINDER LIST --- //// REMINDER LIST --- 
//// REMINDER LIST --- //// REMINDER LIST --- //// REMINDER LIST --- 
//// REMINDER LIST --- //// REMINDER LIST --- //// REMINDER LIST --- 
//// REMINDER LIST --- //// REMINDER LIST --- //// REMINDER LIST --- 



export const fireAddReminderEmail = (email, calId, name, calCreator) => {
    const reminderData = {
        email,
        name,
        calId,
        calCreator
    }
    return db.ref(`users/${calId}/followers`).push(reminderData)
}

export const fireCheckFollowers = (id) => {
    var ref = db.ref(`users/${id}/followers`)
    return ref.once('value')
}


// EXAMPLE CALENDAR --- EXAMPLE CALENDAR --- EXAMPLE CALENDAR --- 
// EXAMPLE CALENDAR --- EXAMPLE CALENDAR --- EXAMPLE CALENDAR --- 
// EXAMPLE CALENDAR --- EXAMPLE CALENDAR --- EXAMPLE CALENDAR --- 

// export const getExampleImagesForCalender = (name) => {
//     var dbRef = db.ref(`/users/`)
//     var nameRef = dbRef.orderByChild('username').equalTo(name)   
//     return nameRef.once('child_added')   
// }

// export const getExampleImagesForCalender = (name) => {
//     var dbRef = db.ref(`/examples/`)
//     var nameRef = dbRef.orderByChild('calName').equalTo(name)   
//     return nameRef.once('child_added')   
// }

export const getExampleImagesForCalender = (name) => {
    console.log("name = ", name);
    var ref = db.ref(`/examples/${name}`)
    // var nameRef = dbRef.orderByChild('calName').equalTo(name)   
    return ref.once('value')
}


export const addNewExample = (name) => {
    return db.ref(`examples/${name}`).set({
    });    
}

export const addNewExampleImages = (name, url, filename, created_at, path) => {
    var imageData = {
        path,
        filename,
        url,
        created_at
    };
    return db.ref(`examples/${name}/images`).push(imageData);
}


