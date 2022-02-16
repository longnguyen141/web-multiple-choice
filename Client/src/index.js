import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-quill/dist/quill.snow.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './App/store';
import './index.css';



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <BackToTop /> */}
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

