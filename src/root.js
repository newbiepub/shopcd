import React, {Component} from 'react';
import { Provider } from 'react-redux';
import App from "./components/globalNavigation";
import configureStore from "./store/configureStore.js";
const store = configureStore();

export default class ShopApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}