import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { getAuthToken } from '../util/authHeader';

export const baseRequest = axios.create({
    baseURL: '/api',
    headers: {
        'Content-type': 'application/json',
    },
});

export const authRequest = axios.create({
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

function fetchResourceNoAuth<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return baseRequest.get<T>(url, config);
}

function fetchResourceAuth<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return authRequest.get<T>(url, config);
}

function requestNoAuth<T>(url: string, method: Method, config?: AxiosRequestConfig): AxiosPromise<T> {
    return baseRequest({url: url, method: method, ...config}) as AxiosPromise<T>;
}

function requestAuth<T>(url: string, method: Method, config?: AxiosRequestConfig): AxiosPromise<T> {
    return authRequest({url: url, method: method, ...config}) as AxiosPromise<T>;
}

export { fetchResourceNoAuth, fetchResourceAuth, requestNoAuth, requestAuth };