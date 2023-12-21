import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  BrowserRouter,
  Routes
} from 'react-router-dom'
import { CssBaseline } from '@mui/material';
import './index.css';
// import routes from './routes'
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/main.scss'
import Navigation from './components/form-input/template/navigation';
import AppRoute from './routes';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </PersistGate>
    </Provider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
