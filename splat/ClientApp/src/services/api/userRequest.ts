import IUser from "../../models/User";
import ILogin from "../../models/Login";
import { baseRequest, authRequest } from './genericRequest';

function login(loginInfo: ILogin) {
    return baseRequest.post<IUser>('/login', loginInfo);
}

function logout() {
    return authRequest.post<IUser>('/logout');
}

export { login, logout};
