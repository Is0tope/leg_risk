import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga4';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const GA_NUMBER = 'G-EPY74VTTMK'
ReactGA.initialize(GA_NUMBER);
ReactGA.send('pageview');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
