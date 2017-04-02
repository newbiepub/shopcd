import {LOGIN, LOGOUT} from "../constants/actionType";
import config from "../config.json";
import { ToastAndroid } from "react-native";
function loginActions(user) {
    return {
        type: LOGIN,
        user
    }
}

function logoutAction() {
    return {
        type: LOGOUT
    }
}

export function logout(instance) {
    return (dispatch, getState) => {
        instance.props.navigator.popToTop();
        dispatch(logoutAction());
    }
}

export function login(username, password, instance) {
    return (dispatch, getState) => {
        fetch(`${config.api}/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            return res.json();
        }).then(response => {
            if (response.token) {
                fetch(`${config.api}/user/authorized`, {
                    method: "GET",
                    headers: {
                        "Authorization": `JWT ${response.token}`
                    }
                }).then(res => {
                    return res.json();
                }).then(user => {
                    if(user) {
                        fetch(`${config.api}/roles/findOne?id=${user.role}`, {
                            method: "GET"
                        }).then(res => res.json())
                            .then(role => {
                                dispatch(loginActions({data: user, userRole: role}));
                                instance.props.navigator.pop();
                            })
                    } else {
                        ToastAndroid.show('User not found', ToastAndroid.SHORT);
                    }
                })
            } else {
                ToastAndroid.show('User not found', ToastAndroid.SHORT);
            }
        })
    }
}