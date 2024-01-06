import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Loader from './context/loader';
import PerfectWeekView from './compoents/perfectWeekView';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const baseUrl = 'http://localhost:3000';

root.render(
  <React.StrictMode>
    <Loader >
      <PerfectWeekView />
    </Loader>
  </React.StrictMode>
);
