import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Loader from './compoents/loader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const baseUrl = 'http://localhost:3000';

root.render(
  <React.StrictMode>
    <Loader />
  </React.StrictMode>
);
