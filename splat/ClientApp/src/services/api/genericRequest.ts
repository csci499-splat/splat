import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

const baseRequest = axios.create({
    baseURL: '/api',
    headers: {
        'Content-type': 'application/json',
    },
});

const authRequest = axios.create({
    baseURL: '/api',
    headers: {
        'Authorization': '',
        'Content-type': 'application/json',
    },
});

export { baseRequest, authRequest };
