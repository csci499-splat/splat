import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { matchSorter } from 'match-sorter';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { Category, Item } from '../../models/BackendTypes';
import { baseRequest } from '../../services/api/genericRequest';

type ItemAutocompleteProps = {
    value: Item | null;
    category: Category | null | undefined;
    onValueChange: (option: Item | null) => void;
    InputProps?: {
        error: boolean,
        helperText: string,
    };
};

const ItemAutocomplete: FC<ItemAutocompleteProps> = (props: ItemAutocompleteProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly Item[]>([]);
    const loading = open && options.length === 0;

    const filterOptions = (options: Item[], { inputValue }) => matchSorter(options, inputValue, 
        {keys: ['name', 'description']});

    useEffect(() => {
        let active = true;

        if(!loading) return undefined;

        (async () => {
            try {
                let res = await baseRequest.get<Item[]>('/items', { 
                    params: {
                        c: props.category?.id 
                    },
                });

                if (active) {
                    setOptions(res.data);
                }
            } catch(err) {
                
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

    useEffect(() => {
        setOptions([]);
    }, [props.category]);

    return (
        <>
        <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{width: '100%'}}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => `${option.name} - ${option.description}`}
        options={options}
        loading={loading}
        renderInput={(params) => (
            <TextField
            {...params}
            label="Item"
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

export default ItemAutocomplete;