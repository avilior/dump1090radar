import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from "redux-thunk";

import { setupWebsocket } from "./actions/websocket";
import rootReducer from "./reducers";

import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';



// the host port of the websocket to connect to (the python server)
let ws_protocol = (window.location.protocol === 'http:')? 'ws' : 'wss';
let ws_host = window.location.hostname;
let ws_port = 4000;
const ws_url = new URL("/ws", `${ws_protocol}://${ws_host}:${ws_port}`);



const home_lat = 45.25056;
const home_lon = -75.89996;


const setupStore = () => {
    const initialState = {
        maxAge: 120,
        ICAO24Table: {},
        markers: {},
        showLatLon: false
    };

    const middleware = [];

    if (process.env.NODE_ENV === "development") {
        const { createLogger } = require("redux-logger");
        middleware.push(createLogger());
    }

    return setupWebsocket({ ws_url }).then(({ send, receive }) => {
        middleware.push(thunkMiddleware.withExtraArgument({ send }));

        const store = createStore(
            rootReducer,
            initialState,
            applyMiddleware(...middleware),
        );

        receive(store.dispatch);
        //requestUsers(send);
        return store;
    });
};




setupStore().then((store) =>
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    ),
);

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
