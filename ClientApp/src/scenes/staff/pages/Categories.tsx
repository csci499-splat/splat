import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';

interface CategoryProps extends IStaffChild {
    
}

const Categories: FC<CategoryProps> = (props: CategoryProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Categories;
