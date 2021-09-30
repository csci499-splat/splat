import IUser from '../../models/User';

function getAuthToken() {
    const user: IUser = JSON.parse(localStorage.getItem("user") || '{}');

    if(user !== null) {
        return user.authHeader?.token;
    }

    return null;
}

function setAuthToken(user: IUser, newToken: string) {
    user.authHeader = {token: "Bearer " + newToken};

    localStorage.setItem("user", JSON.stringify(user));
}

export { getAuthToken, setAuthToken };