import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers'

// style
import './style/normalize.css'
import 'antd/dist/antd.css';
import './style/style.scss';

//you have no middleware yet but if you did it would go here, something like 'thunk'
const createStoreWithMiddleware = applyMiddleware()(createStore);

const ReduxWrapped = (
    <Provider store={createStoreWithMiddleware(reducers)}>
        <App />
    </Provider>
)

ReactDOM.render(ReduxWrapped, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



