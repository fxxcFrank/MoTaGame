import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Title from './Title';
import * as serviceWorker from './serviceWorker';
import store from './store';
import '../public/css/antd.css'
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Title />
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);
serviceWorker.unregister();
