import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from './store'; // store的引入要放在App之前，避免無法直接import store
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// React
import { Provider } from 'react-redux';

import i18n from './i18n.js'

const root = ReactDOM.createRoot(document.getElementById('root'));


/*
如果在最外層，加上StrictMode，初始化時就會render 2次

<React.StrictMode>
</React.StrictMode>

*/

// 放棄使用嚴格模式，render 2次會導致一堆初始化的BUG，找人麻煩
// 而且build出來的情況，是不會render 2次的，已脫離環境模擬
// <React.StrictMode>

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
