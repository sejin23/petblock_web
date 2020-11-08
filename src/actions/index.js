import * as types from './ActionTypes';
import { URL_PERMIT } from '../config';

export const fetch_signin = (id, pw) => {
    return dispatch => {
        dispatch(login_request());
        fetch(URL_PERMIT + 'signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: id,
                password: pw
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.result === 'success') {
                dispatch(login_success(id, pw));
            } else if(res.result === 'failure') {
                dispatch(login_failure());
            } else {
                console.log('error');
                dispatch(login_failure());
            }
        })
    }
};

export const login_request = () => ({
    type: types.LOGIN_REQUEST
});

export const login_success = (_id, _pw) => ({
    type: types.LOGIN_SUCCESS,
    id: _id,
    pw: _pw
});

export const login_failure = () => ({
    type: types.LOGIN_FAILURE
});

export const logout = () => ({
    type: types.LOGOUT
});