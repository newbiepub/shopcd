import {GET_DATA, GET_COLLECTION, GET_CART_ITEM} from "../constants/actionType";
import config from "../config.json";
function getCDAction (data) {
    return {
        type: GET_DATA,
        data
    }
}

export function getCD (limit) {
    return (dispatch, getState) => {
        fetch(config.api + "/cd?limit=" + limit, {
            method: "GET"
        }).then(res => res.json())
            .then(data => {
                return dispatch(getCDAction(data));
            })
    }
}

function getCollectionAction(data) {
    return {
        type: GET_COLLECTION,
        data
    }
}

export function getCollection(collectionName, limit) {
    return (dispatch, getState) => {
        fetch(`${config.api}/${collectionName}?limit=${limit}`, {
            method: "GET"
        }).then(res => {
            return res.json()
        }).then(data => {
            return dispatch(getCollectionAction(data));
        })
    }
}
function getCartItemsAction (cartItems) {
    return {
        type: GET_CART_ITEM,
        cartItems
    }
}

export function getCartItems(userId) {
    return (dispatch, getState) => {
        fetch(`${config.api}/cart/findOne?userId=${userId}`, {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                if(response.cartItem) {
                    dispatch(getCartItemsAction(response.cartItem.length));
                } else {
                    dispatch(getCartItemsAction(0));
                }
            })
    }
}