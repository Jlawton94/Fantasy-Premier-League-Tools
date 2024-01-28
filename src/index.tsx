import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import BaseDataProvider from './context/baseDataContext';
import Router from './router';
import SpinnerProvider from './context/spinnerContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const baseUrl = 'http://localhost:3000';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SpinnerProvider>
        <BaseDataProvider>
          <Router />
        </BaseDataProvider>
      </SpinnerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
