import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseRequest, authRequest } from './services/api/genericRequest';
import { getAuthToken } from './services/util/authHeader';

//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

// https://stackoverflow.com/questions/55149816/is-it-possible-to-use-toast-in-axios-interceptors

const errorHandler = error => {
    toast.error(`Error ${error.request.status}: ${error.response.statusText}`, {
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

authRequest.interceptors.request.use(config => {
    const token = getAuthToken();

    if(token !== null) {
        config.headers.Authorization = token;
    }

    return config;
});

baseRequest.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error),
);

authRequest.interceptors.response.use(
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

