import React, { FC, ReactElement, useEffect, useState } from 'react';
import { TextField, Autocomplete, CircularProgress }
    from '@mui/material';
import { matchSorter } from 'match-sorter';

type Category = {
    id: string;
    name: string;
    description: string;
};

type CategoryAutocompleteProps = {
    value: Category | null;
    onValueChange: (option: Category | null) => void;
    InputProps?: {
        error: boolean,
        helperText: string,
    };
};

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const CategoryAutocomplete: FC<CategoryAutocompleteProps> = (props: CategoryAutocompleteProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly Category[]>([]);
    const loading = open && options.length === 0;

    const filterOptions = (options: Category[], { inputValue }) => matchSorter(options, inputValue, 
        {keys: ['name', 'description']});

    useEffect(() => {
        let active = true;

        if(!loading) return undefined;

        (async () => {

            // simulate getting data
            await sleep(1000);

            if(active) {
                setOptions([...categoryTests]);
            }
        })();

        return () => {
            active = false
        };
    }, [loading]);

    useEffect(() => {
        if(!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <>
        <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{width: '100%'}}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        renderInput={(params) => (
            <TextField
            {...params}
            label="Category"
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                    </>
                )
            }}
            error={props.InputProps?.error}
            helperText={props.InputProps?.helperText}
            />
        )}
        filterOptions={filterOptions}
        value={props.value}
        onChange={(event, value) => props.onValueChange(value)}
        />
        </>
    )
};

const categoryTests: Category[] = [
    {
        id: '1',
        name: 'test 1',
        description: 'test category 1',
    },
    {
        id: '2',
        name: 'test 2',
        description: 'test category 2',
    },
    {
        id: '3',
        name: 'test 3',
        description: 'test category 3',
    },
];

export default CategoryAutocomplete;