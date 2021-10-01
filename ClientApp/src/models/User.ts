<<<<<<< HEAD
import IAuthHeader from "./AuthHeader";

export default interface User {
    name: string;
    email: string;
    userName: string;
    authHeader: IAuthHeader;
    role: Array<string>;
};
=======
﻿import IAuthHeader from "./AuthHeader";

export default interface IUser {
    name?: string;
    email: string;
    userName: string;
    authHeader: IAuthHeader;
    role?: string;
};
>>>>>>> 83345f07c3805ee68229cbe4b831e5af0385037e
