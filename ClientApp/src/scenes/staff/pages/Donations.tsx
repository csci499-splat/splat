import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';

interface DonationProps extends IStaffChild {
    
}

const Donations: FC<DonationProps> = (props: DonationProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Donations;
