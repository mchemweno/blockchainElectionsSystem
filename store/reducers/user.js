import {AUTO_LOGIN, LOGIN, LOGOUT} from "../actions/user";

const initialState = {
    isLoggedIn: null,
    email: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    admin: null,
    id: null,
    username: null,
}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                ...action.user,
                ...action.token,
                isLoggedIn: true
            }
        case AUTO_LOGIN:
            return {
                ...action.data,
                isLoggedIn: true
            }
        case LOGOUT:
            return {
                ...initialState
            }
        default:
            return state;
    }
}

export default userReducer;
