import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import smoothscroll from 'smoothscroll-polyfill';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducers';

smoothscroll.polyfill();

const store = (window.store = createStore(reducer));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
