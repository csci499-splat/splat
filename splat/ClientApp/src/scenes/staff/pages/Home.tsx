import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';

interface HomeProps extends IStaffChild {
    
}

const Home: FC<HomeProps> = (props: HomeProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Home;
