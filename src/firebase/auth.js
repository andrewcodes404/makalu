import { auth } from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

// Check for user
export const checkAuthStateChanged = () => {
    let result =  auth.onAuthStateChanged((user)=>{
        if (user) {
            console.log('yes user');
            result = true
            return result  
        } else {
            result = true
            return result
        }
    })
    return result
} 


//Verify Email
export const doSendEmailVerification = (authUser) =>
    auth.sendEmailVerification(authUser)


// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
    auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
    auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);