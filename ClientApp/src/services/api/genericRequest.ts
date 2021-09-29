import axios from 'axios';
import { getAuthToken } from '../util/authHeader';

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

authRequest.interceptors.request.use(config => {
    const token = getAuthToken();

    if(token !== null) {
        config.headers.Authorization = token;
    }
});

export { baseRequest, authRequest };