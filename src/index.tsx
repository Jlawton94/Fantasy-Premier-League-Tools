import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import BaseData from './context/loader';
import Router from './router';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const baseUrl = 'http://localhost:3000';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BaseData>
        <Router />
      </BaseData>
    </BrowserRouter>
  </React.StrictMode>
);
