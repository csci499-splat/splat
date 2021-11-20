import {
    Dialog, DialogContent, DialogActions, DialogTitle,
    Paper, TableBody, TableContainer, TableHead, TableRow, Typography, Button, Autocomplete, TextField, CircularProgress
} from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { baseRequest } from '../../../services/api/genericRequest';
import { TrendReport } from '../../../models/TrendReport'
import { BarChart, ComposedChart, Line, Bar, Cell, XAxis, YAxis, Tooltip, Label, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import ItemAutocomplete from '../../student/ItemAutocomplete';
import { Item, Category } from '.././../../models/BackendTypes';
import { matchSorter } from 'match-sorter';
import { useEffect } from 'react';

const TrendReportTest: TrendReport = {
    entries: [
        {
            category: {
                id: '',
                name: '',
                limit: 0,
                icon: '',
                description: '',
                visible: true,
                createdAt: '',
            },
            trendItemEntries: [
                {
                    item: {
                        id: '312',
                        name: 'Water',
                        categoryId: '44',
                        category: {
                            id: '',
                            name: '',
                            limit: 0,
                            icon: '',
                            description: '',
                            visible: true,
                            createdAt: '',
                        },
                        description: '',
                        visible: true,
                        createdAt: '',
                    },
                    requestBin: [
                        {
                            requestCount: 10,
                            binTime: {
                                startDate: new Date(2021, 11, 1),
                                endDate: new Date(2021, 11, 7),
                            }
                        },
                        {
                            requestCount: 5,
                            binTime: {
                                startDate: new Date(2021, 11, 8),
                                endDate: new Date(2021, 11, 14),
                            }
                        },
                    ],
                    average: 9,
                },
                {
                    item: {
                        id: '123',
                        name: 'Milk',
                        categoryId: '2',
                        category: {
                            id: '',
                            name: '',
                            limit: 0,
                            icon: '',
                            description: '',
                            visible: true,
                            createdAt: '',
                        },
                        description: '',
                        visible: true,
                        createdAt: '',
                    },
                    requestBin: [
                        {
                            requestCount: 44,
                            binTime: {
                                startDate: new Date(2021, 11, 1),
                                endDate: new Date(2021, 11, 7),
                            }
                        },
                        {
                            requestCount: 42,
                            binTime: {
                                startDate: new Date(2021, 11, 8),
                                endDate: new Date(2021, 11, 14),
                            }
                        },
                    ],
                    average: 9,
                },



            ],


        }]
};

const barChartData = [
    {
        week: 'Week 1',
        item1: 40,
        item2: 24,
        item3: 20,
        total: 84
    },
    {
        week: 'Week 2',
        item1: 20,
        item2: 34,
        item3: 15,
        total: 69
    },
    {
        week: 'Week 3',
        item1: 18,
        item2: 27,
        item3: 9,
        total: 54
    },
    {
        week: 'Week 4',
        item1: 51,
        item2: 12,
        item3: 10,
        total: 73
    }
];


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
const TrendReportDialog: FC<TrendReportDialogProps> = (props: TrendReportDialogProps): ReactElement => {
    const [trendReport, setTotalReport] = useState<TrendReport[]>([]);
    const [options, setOptions] = useState<readonly Category[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const loading = open && options.length === 0;
    const barElements = [];
    const colorArray = ['#8884d8', '#82ca9d', '#9dca82'];
    const filterOptions = (options: Category[], { inputValue }) => matchSorter(options, inputValue,
        { keys: ['name', 'description'] });

    useEffect(() => {
        let active = true;

        if (!loading) return undefined;
        (async () => {
            await sleep(1000);

            let res = await baseRequest.get<Category[]>('/categories');

            if (active) {
                setOptions(res.data);
            }
        })();

        return () => {
            active = false
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);


    const getTrendReport = async () => {
        // let res = await baseRequest.get<TrendReport[]>('/trendReport');
        // setChartData(tranformData(res.data));
        setChartData(tranformData(TrendReportTest));
    };

    // tranform the data to what the chart needed
    const tranformData = (data) => {
        const items = data.entries[0].trendItemEntries;
        let weekData: any[] = [];
        let weekNameArray: string[] = [];
        if (items.length == 0) {
            return weekData;
        } else {
            let firstItem = items[0];
            for (let i = 0; i < firstItem.requestBin.length; i++) {
                const element = firstItem.requestBin[i];
                const weekKey = getKeyFromStartAndEndDate(element.binTime.startDate, element.binTime.endDate);
                weekNameArray.push(weekKey);
                let itemName = firstItem.item.name;
                let item: any = {};
                item.week = weekKey;
                item[itemName] = element.requestCount;
                item.total = element.requestCount;
                weekData.push(item);
            }
            for (let k = 1; k < items.length; k++) {
                const other = items[k];
                for (let i = 0; i < other.requestBin.length; i++) {
                    const element = other.requestBin[i];
                    const weekKey = getKeyFromStartAndEndDate(element.binTime.startDate, element.binTime.endDate);
                    let itemName = other.item.name;
                    for (let j = 0; j < weekData.length; j++) {
                        let weekItem :any = weekData[j];
                        if (weekItem.week == weekKey) {
                            weekItem[itemName] = element.requestCount;
                            weekItem.total = weekItem.total+element.requestCount;
                            weekData[j] = weekItem;
                        }
                    }
                }
            }
        }
        return weekData;
    }

    const getKeyFromStartAndEndDate = (startDate, endDate) =>{
        return (1900+startDate.getYear())+'/'+startDate.getMonth()+'/'+startDate.getDate()+'-'
            +(1900+endDate.getYear())+'/'+endDate.getMonth()+'/'+endDate.getDate();
    }

    React.useEffect(() => {
        getTrendReport();

    }, [])
    
    var lis: any = [];

    for (var i=0; i<TrendReportTest.entries[0].trendItemEntries.length; i++) {
        let item = TrendReportTest.entries[0].trendItemEntries[i];
        lis.push(<Bar key={item.item.name} dataKey={item.item.name} stackId="a" fill={colorArray[i]} />);
    }

    return (
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
                            sx={{ width: '100%' }}
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
                        <ComposedChart
                            width={500}
                            height={300}
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {
                                // TrendReportTest.entries[0].trendItemEntries.forEach((item, index) => {
                                    // <Bar dataKey="Milk" stackId="a" fill="#8884d8" />
                                // })
                                lis
                            }
                            {/* <Bar dataKey="Milk" stackId="a" fill="#8884d8" />
                            <Bar dataKey="Water" stackId="a" fill="#82ca9d" /> */}
                            <Line type="monotone" dataKey="total" stroke="#ff7300" />
                        </ComposedChart>
                    </DialogContent>
                    <DialogActions sx={{ margin: 1 }}>
                        <Button variant="outlined" onClick={props.onClose} color="secondary">Closed</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
};
export default TrendReportDialog;