
import rootReducer from './Reducers'
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { applyMiddleware,createStore } from "redux";
import asyncDispatchMiddleware from "async-dispatch";
import { persistCombineReducers } from 'redux-persist';


import { persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
  key: 'root',
  stateReconciler:autoMergeLevel2,
  storage,
}

const persistedReducer = persistCombineReducers(persistConfig, rootReducer)

const loggerMiddleware = createLogger();


export default () => {
  let store = createStore(
    persistedReducer, composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware, asyncDispatchMiddleware)))
  let persistor = persistStore(store)
  return { store, persistor }
}