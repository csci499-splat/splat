import { Button } from '@mui/material';
import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';
import CategoriesAddDialog from '../subcomponents/CategoriesAddDialog';
import CategoriesTable from '../subcomponents/CategoriesTable';

interface CategoryProps extends IStaffChild {
    
}

const Categories: FC<CategoryProps> = (props: CategoryProps): ReactElement => {

    const [addCategoriesOpen, setAddCategoriesOpen] = React.useState(false);
    
    const handleOpenAddCategories = () => {
        setAddCategoriesOpen(true);
    }

    // TODO: refresh data in the table when a new item is added

    return (
        <>
        <Button
        variant="contained"
        onClick={handleOpenAddCategories}
        >
            Create Category
        </Button>
        <CategoriesTable />
        <CategoriesAddDialog
        onClose={() => setAddCategoriesOpen(false)}
        open={addCategoriesOpen}
        />
        </>
    )
};

export default Categories;
