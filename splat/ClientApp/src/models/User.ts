import IAuthHeader from "./AuthHeader";

type User = {
    name?: string | null;
    email: string;
    authHeader?: IAuthHeader;
    roles?: string[];
};

export default User;
