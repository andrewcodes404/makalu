import { combineReducers } from 'redux';
import UserReducer from './reducerUser'

const rootReducer = combineReducers({
    user: UserReducer,
});

export default rootReducer;