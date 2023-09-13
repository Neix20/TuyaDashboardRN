/* eslint-disable prettier/prettier */

import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";

import rootReducer from "./reducers";

import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

/**
 * Redux Setting
 */
const persistConfig = {
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    key: "root",
    timeout: 60 * 60 * 24 * 7,
};

let middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
    middleware.push(logger);
}

// This Prevents Redux From Logging
// middleware = [];

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(...middleware));
const persistor = persistStore(store);

export { store, persistor };
