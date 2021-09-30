import IUser from "../../models/User";
import ILogin from "../../models/Login";
import { baseRequest, authRequest } from './genericRequest';

function login(loginInfo: ILogin) {
    return baseRequest.post('/login', loginInfo);
}

function logout() {
    return authRequest.post('/logout');
}

export { login, logout};
