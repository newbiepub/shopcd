import { combineReducers } from 'redux';
import diskData from "./data";
import account from "./login";

const appReducers = combineReducers({
    diskData,
    account
});

export default appReducers;