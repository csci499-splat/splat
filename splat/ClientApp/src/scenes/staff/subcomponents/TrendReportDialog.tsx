import {
    Dialog, DialogContent, DialogActions, DialogTitle,
    Button, Autocomplete, TextField, CircularProgress, Stack, IconButton, Tooltip
} from '@mui/material';
import React, { FC, ReactElement, useState, useEffect } from 'react';
import { DateRange, TrendEntry, TrendItemEntry, TrendReport } from '../../../models/TrendReport'
import { BarChart, ComposedChart, Line, Bar, Cell, XAxis, YAxis, Tooltip as TooltipCharts, Label, Legend, ResponsiveContainer, CartesianGrid, LineChart } from 'recharts';
import { Category } from '../../../models/BackendTypes';
import CategoryAutocomplete from '../../student/CategoryAutocomplete';
import { Refresh } from '@mui/icons-material';
import {ReportDialogProps} from '../pages/Reports';
import axios from 'axios';

interface TrendReportDialogProps extends ReportDialogProps {

}

const TrendReportTest: TrendReport = {
    entries: [
        {
            category: {
                id: '',
                name: 'Test category',
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
                        {
                            requestCount: 60,
                            binTime: {
                                startDate: new Date(2021, 11, 15),
                                endDate: new Date(2021, 11, 21),
                            }
                        },
                    ],
                    average: 40,
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
                        {
                            requestCount: 43,
                            binTime: {
                                startDate: new Date(2021, 11, 15),
                                endDate: new Date(2021, 11, 21),
                            }
                        },
                    ],
                    average: 43,
                },
                {
                    item: {
                        id: '123',
                        name: 'Milk2',
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
                            requestCount: 30,
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
                        {
                            requestCount: 40,
                            binTime: {
                                startDate: new Date(2021, 11, 15),
                                endDate: new Date(2021, 11, 21),
                            }
                        },
                    ],
                    average: 37.33,
                },
            ],
        },
    ]
};


type ParsedTrendResult = {
    itemCounts: any[];
    trendLines: any[];
};

type CategoryListElement = {
    category: Category;
    index: number;
};

const TrendReportDialog: FC<TrendReportDialogProps> = (props: TrendReportDialogProps): ReactElement => {
    const [trendReport, setTrendReport] = useState<TrendReport>();
    const [categories, setCategories] = useState<CategoryListElement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>();
    const [categoryIndex, setCategoryIndex] = useState<number>(0);
    const [colorArray, setColorArray] = useState<string[]>([]);

    const extractCategories = (report: TrendReport): CategoryListElement[] => {
        return report.entries.map((entry, index) => ({ category: entry.category, index: index }));
    };

    const handleChangeCategory = (newCategory: Category | null) => {
        setSelectedCategory(newCategory);
        if(trendReport) {
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].category.id === newCategory?.id) {
                    setCategoryIndex(i);
                    handleUpdateColors();
                }
            }
        }
    };

    const handleUpdateColors = () => {
        if(trendReport) {
            setColorArray(trendReport.entries[categoryIndex].trendItemEntries.map((entry) => 
                `rgb(${[1,2,3].map(x=>Math.random()*256|0)})`
            ));
        }
    }

    const getTrendReport = async () => {
        try {
            let res = await axios.get<TrendReport>('/trendReports', {
                params: {
                    // @ts-ignore
                    dateFrom: props.startDateValue.toISOString(),
                    // @ts-ignore
                    dateTo: props.endDateValue.toISOString(),
                }
            });

            setCategories(extractCategories(res.data));
            setTrendReport(res.data);
        } catch(err) {

        }
    };

    useEffect(() => {
        if(props.open)
            getTrendReport();
    }, [props.open]);

    type LineOfBestFit = {
        m: number;
        b: number;
    };

    const getLineOfBestFit = (entry: TrendItemEntry): LineOfBestFit => {
        let avgX = (entry.requestBin.length - 1) / 2;
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
        getTrendReport();
    }, []);

    return (
        <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="lg"
        >
            <DialogTitle>Trend Report</DialogTitle>
            <DialogContent>
            <Stack direction="row" justifyContent="center" alignItems="center">
                <div style={{ width: '50%', paddingTop: 20, marginBottom: 20 }}>
                    <CategoryAutocomplete
                    value={selectedCategory}
                    onValueChange={(option) => handleChangeCategory(option)}
                    options={categories?.map((elem) => elem.category)}
                    />
                </div>
                {Boolean(selectedCategory) && (
                <Tooltip title="Change colors">
                    <IconButton
                    color="primary"
                    onClick={handleUpdateColors}
                    sx={{ width: 45, height: 45, marginLeft: 1 }}
                    >
                        <Refresh />
                    </IconButton>
                </Tooltip>
                )}
            </Stack>
            
            
            {Boolean(selectedCategory) ? (
            <>
            <ResponsiveContainer width={800} height={500}>
                <BarChart
                data={parseTrendData(TrendReportTest.entries[categoryIndex]).itemCounts}
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
                    <TooltipCharts />
                    <Legend 
                    height={10}
                    verticalAlign="top"
                    />
                    { TrendReportTest.entries[categoryIndex].trendItemEntries.map((entry, index) => (
                        <Bar key={index} dataKey={entry.item.name} stackId="a" fill={colorArray[index]} />
                    )) }
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width={800} height={400}>
                <LineChart
                data={parseTrendData(TrendReportTest.entries[categoryIndex]).trendLines}
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
                    <Legend 
                    height={36}
                    verticalAlign="top"
                    />
                    { TrendReportTest.entries[categoryIndex].trendItemEntries.map((entry, index) => (
                        <Line key={index} dataKey={entry.item.name} stroke={colorArray[index]} />
                    )) }
                </LineChart>
            </ResponsiveContainer>
            </>
            ) : (
                <h3 style={{ marginTop: 50 }} >Select a category to get started</h3>
            )}
            </DialogContent>
            <DialogActions sx={{ margin: 1 }}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};
export default TrendReportDialog;
