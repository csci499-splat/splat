import { Dialog, DialogContent,DialogActions, DialogTitle,
    Paper, TableBody, TableContainer, TableHead, TableRow,Typography, Button, Autocomplete, TextField, CircularProgress, Grid } from '@mui/material';
import React, { FC, ReactElement, useState, PureComponent} from 'react';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { baseRequest } from '../../../services/api/genericRequest';
import {TrendReport} from '../../../models/TrendReport'
import { ComposedChart,Line,Area,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from 'recharts';
import ItemAutocomplete from '../../student/ItemAutocomplete';
import {Item, Category} from '.././../../models/BackendTypes';
import { matchSorter } from 'match-sorter';
import { useEffect } from 'react';
import CategoryAutocomplete from '../../student/CategoryAutocomplete';
import { FormikProvider, useFormik } from 'formik';
import { FormatItalic } from '@mui/icons-material';

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
    const formik = useFormik({
        initialValues: TrendReportTest,
        onSubmit: async (values) => {
            console.log(values);
            props.onClose();
        },
    });


    return(
        <>
        <div>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>TrendReport</DialogTitle>
            <DialogContent>
                <FormikProvider
                value={formik}
                >
                    {formik.values.entries.map((selection, index: number) => {
                        return(
                            <>
                            <Grid>
                            <CategoryAutocomplete
                            value={formik.values.entries[index].category}
                            onValueChange={(newValue) => {
                                formik.setFieldValue(`entries[${index}].category`, newValue);

                            }}
                            />
                            </Grid>
                            </>
                        )
                    })}
                </FormikProvider>
                
                
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