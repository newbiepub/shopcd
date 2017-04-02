import {GET_DATA, GET_COLLECTION, GET_CART_ITEM} from "../constants/actionType";

const initialState = {
    cd: [],
    data: [],
    cartItem: 0
};

export default getDataReducer(initialState);

function getDataReducer(initialState) {
    if(initialState) {
        return function getDataFn(state = initialState, action = {}) {
            switch (action.type) {
                case GET_DATA: {
                    return {
                        ...state,
                        cd: action.data
                    }
                }
                case GET_COLLECTION: {
                    return {
                        ...state,
                        data: action.data
                    }
                }
                case GET_CART_ITEM: {
                    return {
                        ...state,
                        cartItem: action.cartItems
                    }
                }
                default:
                    return {
                        ...state
                    }
            }
        }
    }
}