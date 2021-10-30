import React, { FC, ReactElement } from 'react';
import { DatePicker, LocalizationProvider} from '@mui/lab';
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { IStaffChild } from '../Staff';
import {TotalReport} from '../../../models/TotalReport';
import { useState } from 'react';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import FormControl from '@mui/material/FormControl';
import TotalReportDialog from '../subcomponents/TotalReportDialog';
import TrendReportDialog from '../subcomponents/TrendReportDialog';


interface ReportProps extends IStaffChild {
    
}

const Reports: FC<ReportProps> = (props: ReportProps): ReactElement => {
    
    const [startDateValue, setStartDateValue] = React.useState<Date | null>(new Date());
    const [endDateValue, setEndDateValue] = React.useState<Date | null>(new Date());
    const [type, setType] = React.useState('');

    const [dialogOpen, setDialogOpen] = useState({totalReport: false, trendReport: false});
    

    const handleDialogOpen = (dialog: 'totalReport' | 'trendReport') => {
        setDialogOpen((prevState) => ({ ... prevState, [dialog]: true}));
        
    };
    const handleDialogClose = (dialog: 'totalReport' | 'trendReport') => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: false}))
    };
    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };
    
    return (
        <>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <h1>{props.pageName}</h1>
            <Stack spacing={3}>
            <MobileDatePicker
            label="Select start date"
            value={startDateValue}
            maxDate={endDateValue}
            onChange={(newStartDateValue) => {
                setStartDateValue(newStartDateValue)
            }}
            renderInput={(params) => <TextField {...params} />}
            />
            <Box sx = {{ mx:2}}> to </Box>
            <MobileDatePicker
            label="Select end date"
            value={endDateValue}
            minDate= {startDateValue}
            maxDate={endDateValue}
            onChange={(newEndDateValue) => {
                setEndDateValue(newEndDateValue)
            }}
            renderInput={(params) => <TextField {...params} />}
            />
            </Stack>


        <Select
        id="reportType"
        value={type}
        onChange={handleTypeChange}
        label="Type"
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            <MenuItem value="totalReport" 
            onClick={() => handleDialogOpen('totalReport')}

            >Total Report
            </MenuItem>
            <MenuItem value="trendReport"
            onClick={() => handleDialogOpen('trendReport')}          
            >Trend Report</MenuItem>
        </Select>
        </FormControl>
        <TotalReportDialog
        open={dialogOpen.totalReport}
        onClose={() => handleDialogClose('totalReport')}
        />
        <TrendReportDialog
        open={dialogOpen.trendReport}
        onClose={() => handleDialogClose('trendReport')}
        />
        </>
    )
};

export default Reports;
