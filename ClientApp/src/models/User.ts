import IAuthHeader from "./AuthHeader";

export default interface User {
    name: string;
    email: string;
    userName: string;
    authHeader: IAuthHeader;
    role: Array<string>;
};