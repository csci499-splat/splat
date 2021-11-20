import {
    Dialog, DialogContent, DialogActions, DialogTitle,
    Paper, TableBody, TableContainer, TableHead, TableRow, Typography, Button, Autocomplete, TextField, CircularProgress
} from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { DateRange, TrendEntry, TrendItemEntry, TrendReport } from '../../../models/TrendReport'
import { BarChart, ComposedChart, Line, Bar, Cell, XAxis, YAxis, Tooltip, Label, Legend, ResponsiveContainer, CartesianGrid, LineChart } from 'recharts';
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
                            requestCount: 5,
                            binTime: {
                                startDate: new Date(2021, 11, 1),
                                endDate: new Date(2021, 11, 7),
                            }
                        },
                        {
                            requestCount: 55,
                            binTime: {
                                startDate: new Date(2021, 11, 8),
                                endDate: new Date(2021, 11, 14),
                            }
                        },
                    ],
                    average: 30,
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
                    average: 43,
                },
            ],
        },
    ]
};

type TrendReportDialogProps = {
    open: boolean;
    onClose: () => void;
};

type ParsedTrendResult = {
    itemCounts: any[];
    trendLines: any[];
};

const TrendReportDialog: FC<TrendReportDialogProps> = (props: TrendReportDialogProps): ReactElement => {
    const [trendReport, setTotalReport] = useState<TrendReport[]>([]);
    const [chartData, setChartData] = useState<ParsedTrendResult>();
    const colorArray = ['#8884d8', '#82ca9d', '#9dca82'];

    const getTrendReport = async () => {
        // let res = await axios.get<TrendReport[]>('/trendReport');
        // setChartData(tranformData(res.data));
        setChartData(parseTrendData(TrendReportTest.entries[0]));
    };

    type LineOfBestFit = {
        m: number;
        b: number;
    };

    const getLineOfBestFit = (entry: TrendItemEntry): LineOfBestFit => {
        let avgX = Math.floor((entry.requestBin.length - 1) / 2);
        let avgY = entry.average;

        let mNum = 0;
        let mDem = 0;
        
        for(let i = 0; i < entry.requestBin.length; i++) {
            let currentBin = entry.requestBin[i];

            mNum += (i - avgX) * (currentBin.requestCount - avgY);
            mDem += (i - avgX) * (i - avgX);
        }

        let m = mNum / mDem;

        let b = avgY - (m * avgX);

        return { m: m, b: b };
    };

    const parseTrendData = (data: TrendEntry): ParsedTrendResult => {
        let itemCounts: any[] = [];
        let trendLines: any[] = [];

        const binCount: number = data.trendItemEntries[0].requestBin.length;

        const linesOfBestFit: LineOfBestFit[] = data.trendItemEntries.map((entry) => getLineOfBestFit(entry));

        for(let binIndex = 0; binIndex < binCount; binIndex++) {
            let currentWeek: DateRange = data.trendItemEntries[0].requestBin[binIndex].binTime;
            let itemCountsEntry = { name: `${currentWeek.startDate.toLocaleDateString()} - ${currentWeek.endDate.toLocaleDateString()}` };
            let trendLinesEntry = { name: `${currentWeek.startDate.toLocaleDateString()} - ${currentWeek.endDate.toLocaleDateString()}` };

            for(let i = 0; i < data.trendItemEntries.length; i++) {
                let entry: TrendItemEntry = data.trendItemEntries[i];

                itemCountsEntry[entry.item.name] = entry.requestBin[binIndex].requestCount;

                let lineOfBestFitEq: LineOfBestFit = linesOfBestFit[i];
                // binIndex = x     y = mx + b
                trendLinesEntry[entry.item.name] = lineOfBestFitEq.m * binIndex + lineOfBestFitEq.b;
            }
            
            itemCounts.push(itemCountsEntry);
            trendLines.push(trendLinesEntry);
        }

        return { itemCounts: itemCounts, trendLines: trendLines };
    };

    React.useEffect(() => {
        setChartData(parseTrendData(TrendReportTest.entries[0]));
    }, []);

    return (
        <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="lg"
        >
            <DialogTitle>Trend Report</DialogTitle>
            <DialogContent>
                <BarChart
                width={800}
                height={300}
                data={parseTrendData(TrendReportTest.entries[0]).itemCounts}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    { TrendReportTest.entries[0].trendItemEntries.map((entry, index) => (
                        <Bar key={index} dataKey={entry.item.name} stackId="a" fill={colorArray[index]} />
                    )) }
                </BarChart>
                <LineChart
                width={800}
                height={300}
                data={parseTrendData(TrendReportTest.entries[0]).trendLines}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis padding={{ left: 50, right: 50 }} dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    { TrendReportTest.entries[0].trendItemEntries.map((entry, index) => (
                        <Line key={index} dataKey={entry.item.name} stroke={colorArray[index]} />
                    )) }
                </LineChart>
            </DialogContent>
            <DialogActions sx={{ margin: 1 }}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};
export default TrendReportDialog;
