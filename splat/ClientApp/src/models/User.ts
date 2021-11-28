import IAuthHeader from "./AuthHeader";

type User = {
    name?: string | null;
    email: string;
    authHeader?: IAuthHeader;
    role: string;
};

export const UserRoles = [
    'Administrator',
    'Staff',
    'Student',
];

export default User;
