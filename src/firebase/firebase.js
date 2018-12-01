import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const prodConfig = {
    apiKey: process.env.REACT_APP_PROD_API_KEY,
    authDomain: process.env.REACT_APP_PROD_AUTHDOMIAN,
    databaseURL: process.env.REACT_APP_PROD_DB_URL,
    projectId: process.env.REACT_APP_PROD_PROJECT,
    storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_PROD_MESSY_ID
};

const devConfig = {
    apiKey: process.env.REACT_APP_DEV_API_KEY,
    authDomain: process.env.REACT_APP_DEV_AUTHDOMIAN,
    databaseURL: process.env.REACT_APP_DEV_DB_URL,
    projectId: process.env.REACT_APP_DEV_PROJECT,
    storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_DEV_MESSY_ID
};

const config = process.env.NODE_ENV === 'production'
    ? prodConfig
    : devConfig;

if(!firebase.apps.length) {
    firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();




export {
    auth,
    db,
};

