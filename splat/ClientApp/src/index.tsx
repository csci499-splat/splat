import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseRequest, authRequest } from './services/api/genericRequest';
import { getAuthToken } from './services/util/login';
import axios from 'axios';

//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

// https://stackoverflow.com/questions/55149816/is-it-possible-to-use-toast-in-axios-interceptors

const errorHandler = error => {
    let errorText = error.response.data?.message ? error.response.data?.message : error.response.statusText;
    toast.error(`Error ${error.request.status}: ${errorText}`, {
        position: 'top-center',
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: 0,
    });

    return Promise.reject({...error});
}

axios.defaults.baseURL = '/api';
axios.defaults.headers['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
    const token = getAuthToken();

    if(token) {
        config.headers['Authorization'] = token;
    } else {
        config.headers['Authorization'] = 'Bearer empty';
    }

    return config;
    },

    error => {
        Promise.reject(error);
    }
);

baseRequest.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error),
);

axios.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error),
);

ReactDOM.render(
  <BrowserRouter>
  <ToastContainer
  position="top-center"
  autoClose={6000}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss={false}
  draggable={false}
  pauseOnHover
  limit={3}
  />
    <App />
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

