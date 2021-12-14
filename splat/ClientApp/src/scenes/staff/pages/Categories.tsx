import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';
import CategoriesTable from '../subcomponents/CategoriesTable';

interface CategoryProps extends IStaffChild {
    
}

const Categories: FC<CategoryProps> = (props: CategoryProps): ReactElement => {

    return (
        <div style={{ width: '100%' }}>
            <CategoriesTable />
        </div>
    );
};

export default Categories;
