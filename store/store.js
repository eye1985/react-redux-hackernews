import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/asyncFetchReducer';

const loggerMiddleware = createLogger();

let store;
if(process.env['NODE_ENV'] !== 'production'){
    store = createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    );
}else{
    store = createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware
        )
    );
}

export default function configureStore(){
    return store;
};
