import { Dialog, DialogContent,DialogActions, DialogTitle,
    Paper, TableBody, TableContainer, TableHead, TableRow,Typography, Button, Autocomplete, TextField, CircularProgress } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { baseRequest } from '../../../services/api/genericRequest';
import {TrendReport} from '../../../models/TrendReport'
import { LineChart, Line, XAxis, YAxis, Tooltip, Label, Legend, CartesianGrid } from 'recharts';
import ItemAutocomplete from '../../student/ItemAutocomplete';
import {Item, Category} from '.././../../models/BackendTypes';
import { matchSorter } from 'match-sorter';
import { useEffect } from 'react';

const TrendReportTest: TrendReport = {
    entries: [
        {
            category:{
                id:'',
                name:'',
                limit:0,
                icon:'',
                description:'',
                visible:true,
                createdAt:'',
            },
            trendItemEntries:[
                {
                item :{
                    id:'',
                    name:'',
                    categoryId:'',
                    category:{
                        id:'',
                        name:'',
                        limit:0,
                        icon:'',
                        description:'',
                        visible:true,
                        createdAt:'',
                    },
                    description:'',
                    visible:true,
                    createdAt:'',
                },
                requestBin:[
                    {
                    requestCount:10,
                    binTime:{
                        startDate: new Date(2021,10,11),
                        endDate:new Date(2021,11,10),
                    }
                }
                ],
                average:9,
            },
            ],}]};


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

type TrendReportDialogProps = {
    open: boolean;
    onClose: () => void;
    onValueChange: (option: Category | null) => void;
    value: Category | null | undefined;
}
const TrendReportDialog: FC<TrendReportDialogProps> = (props:TrendReportDialogProps) : ReactElement => {
    const [trendReport, setTotalReport] = useState<TrendReport[]>([]);
    const [options, setOptions] = useState<readonly Category[]>([]);
    const[open, setOpen] = useState(false);
    const loading = open && options.length === 0;

    const filterOptions = (options: Category[], {inputValue}) => matchSorter(options,inputValue,
        {keys: ['name', 'description']});

        useEffect(() => {
            let active = true;

            if(!loading) return undefined;
            (async () => {
                await sleep(1000);
                
                let res = await baseRequest.get<Category[]>('/categories');

                if(active) {
                    setOptions(res.data);
                }
            })();

            return() => {
                active = false
            };
        }, [loading]);

        useEffect(() => {
            if(!open) {
                setOptions([]);
            }
        }, [open]);


    const getTrendReport = async () => {
        let res = await baseRequest.get<TrendReport[]> ('/trendReport');
        setTotalReport(res.data);
    };
    React.useEffect(() => {
        getTrendReport();

    }, [])



    return(
        <>
        <div>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>TrendReport</DialogTitle>
            <DialogContent>
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
                    />
                )}
                    filterOptions={filterOptions}
                    value={props.value}
                    onChange={(event, value) => props.onValueChange(value)}
                    />

                <LineChart
                width={730}
                height={250} 
                data={trendReport}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="date">
                    </XAxis>
                    <YAxis type="number">
                    <Label angle={270} position="center"
                    style={{textAnchor: 'middle'}}>
                        Item Count
                    </Label>
                    </YAxis>
                    <Line
                        type="monotone"
                        stroke="#829ddf"
                        dot={false}
                        dataKey="requestCount"
                    />

                </LineChart>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Closed</Button>
            </DialogActions>
        </Dialog>
        </div>
        </>
    )
};
export default TrendReportDialog;