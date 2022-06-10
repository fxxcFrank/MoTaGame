import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Title from './Title';
// import StatusPanel from './Action/StatusPanel';
import Routes from './routes';
// import Action from './Action';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Title />
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//<React.StrictMode>
/*<Provider store={store}>
{/*<StatusPanel />
<Routes />
{/* <Action />
</Provider>
</React.StrictMode>,*/
serviceWorker.unregister();
