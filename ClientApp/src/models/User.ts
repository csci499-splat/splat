import IAuthHeader from "./AuthHeader";

export default interface IUser {
    name?: string;
    email: string;
    userName: string;
    authHeader: IAuthHeader;
    role?: string;
};
