import React, { FC, ReactElement, useEffect, useState } from 'react';
import { TextField, Autocomplete, CircularProgress }
    from '@mui/material';
import { matchSorter } from 'match-sorter';

type Category = {
    id: string;
    name: string;
    description: string;
};

type Item = {
    category: Category;
    id: string;
    name: string;
    description: string;
};

type ItemAutocompleteProps = {
    value: Item | null;
    category: Category | null;
    onValueChange: (option: Item | null) => void;
};

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
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

            // simulate getting data with given props.category
            await sleep(1000);

            if(active) {
                setOptions([...itemTests]);
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
        console.log("category changed");
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
        getOptionLabel={(option) => option.name}
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
            />
        )}
        filterOptions={filterOptions}
        value={props.value}
        onChange={(event, value) => props.onValueChange(value)}
        />
        </>
    )
};

const itemTests: Item[] = [
    {
        category: { 
            id: '1',
            name: 'test 1',
            description: 'test category 1',
        },
        id: '1',
        name: 'Item 1',
        description: 'Item 1 does x',
    },
    {
        category: { 
            id: '1',
            name: 'test 1',
            description: 'test category 1',
        },
        id: '2',
        name: 'Item 2',
        description: 'Item 2 does y',
    },
    {
        category: { 
            id: '1',
            name: 'test 1',
            description: 'test category 1',
        },
        id: '3',
        name: 'Item 3',
        description: 'Item 3 does z',
    },
];

export default ItemAutocomplete;