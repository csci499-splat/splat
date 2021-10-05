import IUser from "../../models/User";
import ILogin from "../../models/Login";
import { requestNoAuth, requestAuth } from './genericRequest';
import { AxiosResponse } from "axios";

function login(loginInfo: ILogin) {
    return requestNoAuth<IUser>('/login', 'POST', {data: loginInfo} );
}

function logout() {
    return requestAuth<IUser>('/logout', 'POST');
}

export { login, logout};
