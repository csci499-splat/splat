import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';

interface UsersProps extends IStaffChild {
    
}

const Users: FC<UsersProps> = (props: UsersProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Users;
