import { combineReducers } from 'redux';
import * as types from '../actions/ActionTypes';

const userDefaultState = {
    isLoggedIn: false,
    isFetching: false,
    info: {}
}

const userReducer = (state = userDefaultState, action) => {
    switch(action.type) {
        case types.LOGIN_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isLoggedIn: true,
                info: {id: action.id, pw: action.pw}
            };
        case types.LOGIN_FAILURE:
            return {
                ...state,
                isFetching: false,
            };
        case types.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                info: {}
            };
        default:
            return state;
    }
}

export default combineReducers({
    user: userReducer
});