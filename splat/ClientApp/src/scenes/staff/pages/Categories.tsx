import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';
import CategoriesTable from '../subcomponents/CategoriesTable';

interface CategoryProps extends IStaffChild {
    
}

const Categories: FC<CategoryProps> = (props: CategoryProps): ReactElement => {

    return (
        <CategoriesTable />
    );
};

export default Categories;
