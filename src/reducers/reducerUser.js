import { LOGIN, LOGOUT, ADD_IMAGE, DELETE_IMAGE, ADD_COVER, ADD_MESSAGE, CALENDAR_COMPLETE } from '../actions'


export default function (state = {
    isAuthenticating: true,
    loggedIn: false,
    id: "",
    name: "",
    email: "",
    emailVerified: false,
    userImages: [],
    coverUrl: null,
    coverPicked: false,
    xmasMessage: "",
    calendarComplete: false,

}, action) {

    switch (action.type) {
        
        case LOGIN:
            const LoggedInState = {
                isAuthenticating: false,
                loggedIn: true,
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.email,
                emailVerified: action.payload.emailVerified,
                userImages: action.payload.userImages,
                coverUrl: action.payload.coverUrl,
                xmasMessage: action.payload.xmasMessage,
                calendarComplete: action.payload.calendarComplete
            }
            return LoggedInState

        case LOGOUT:
            return {
                isAuthenticating: false,
                loggedIn: false,
                id: "",
                name: "",
                email: "",
                emailVerified: false,
                userImages: [],
                coverUrl: null,
                coverPicked: false,
                xmasMessage: "",
                calendarComplete: false
            }

        case ADD_IMAGE:
            const addImageToUserImages = { ...state, userImages: [...state.userImages, action.payload] }
            return addImageToUserImages

        case DELETE_IMAGE:
            const deleteImageFromUserImages = {
                ...state, userImages: [
                    ...state.userImages.slice(0, action.payload),
                    ...state.userImages.slice(action.payload + 1)
                ]
            }
            return deleteImageFromUserImages

        case ADD_COVER:
            const addCover = { ...state, coverUrl: action.payload, coverPicked: true }
            return addCover

        case ADD_MESSAGE:
            const addMessage = { ...state, xmasMessage: action.payload }
            return addMessage

        case CALENDAR_COMPLETE:
            const calendarComplete = { ...state, calendarComplete: true }
            return calendarComplete

        default:
            return state;
    }
}
