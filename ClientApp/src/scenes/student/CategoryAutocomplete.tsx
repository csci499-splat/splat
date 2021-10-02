import React, { FC, ReactElement, useEffect, useState } from 'react';
import { TextField, Autocomplete, CircularProgress }
    from '@mui/material';
import { matchSorter } from 'match-sorter';
import { Category } from '../../models/BackendTypes';

type CategoryAutocompleteProps = {
    value: Category | null | undefined;
    onValueChange: (option: Category | null) => void;
    InputProps?: {
        name?: string,
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
                setOptions([]);
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

export default CategoryAutocomplete;