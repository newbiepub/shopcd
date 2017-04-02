import {LOGIN, LOGOUT} from "../constants/actionType";

const initialState = {
    loginState: false,
    user: {},
    role: {}
};

export default loginReducer(initialState);

function loginReducer(initialState) {
    return function loginFn(state = initialState, action = {}) {
        switch (action.type) {
            case LOGIN: {
                let user = action.user.data,
                    isLogin = !action.user.err,
                    err = action.user.err;
                return {
                    ...state,
                    loginState: isLogin,
                    user,
                    role: action.user.userRole,
                    err
                }
            }
            case LOGOUT: {
                return initialState;
            }
            default:
                return {
                    ...state
                }
        }
    }
}