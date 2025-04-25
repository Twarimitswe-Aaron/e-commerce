// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
// import { Provider } from 'react-redux';
// import store from './redux/store.js';

// const root = createRoot(document.getElementById('root'));
// root.render(
//   <StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </StrictMode>
// );

import { StrictMode } from 'react';
// main.js (or App.js)
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import App from './App'; // Your main application component
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// For older versions of React (before 18)
// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );


