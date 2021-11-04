import React, { FC, ReactElement } from 'react';
import { DatePicker, LocalizationProvider} from '@mui/lab';
import { Button, Grid, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
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
import { TrendReport } from '../../../models/TrendReport';

interface ReportProps extends IStaffChild {
    
}

const Reports: FC<ReportProps> = (props: ReportProps): ReactElement => {
    
    const [startDateValue, setStartDateValue] = React.useState<Date | null>();
    const [endDateValue, setEndDateValue] = React.useState<Date | null>();
    //TODO Create a new type, if user want to add new report type, they don't need to change 3 lines. 
    const [reportType, setReportType] = React.useState<'totalReport' | 'trendReport'|''>('');
    const [dialogOpen, setDialogOpen] = useState({totalReport: false, trendReport: false});
    

    const handleDialogOpen = (dialog: 'totalReport' | 'trendReport'|'') => {
        setDialogOpen((prevState) => ({ ... prevState, [dialog]: true}));
        
    };
    const handleDialogClose = (dialog: 'totalReport' | 'trendReport'|'') => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: false}))
    };
    const handleTypeChange = (event: SelectChangeEvent) => {
        setReportType(event.target.value as 'totalReport' | 'trendReport'|'');
    };
    
    return (
        <>
        
        <Box
        sx={{
            textAlign: 'center',
            position: 'absolute',
            left: '30%',

          }}
        >
        <h1>{props.pageName}</h1>
        <Stack direction="row" spacing={2}  >

        <MobileDatePicker
            label="Select start date"
            value={startDateValue}
            maxDate={endDateValue}
            onChange={(newStartDateValue) => {
                setStartDateValue(newStartDateValue)
            }}
            renderInput={(params) => <TextField {...params} />}
            />
            <Box sx = {{alignItems: 'center',fontSize: 21}}> To </Box>
            <MobileDatePicker
            label="Select end date"
            value={endDateValue}
            minDate= {startDateValue}
            
            maxDate={new Date()}
            onChange={(newEndDateValue) => {
                setEndDateValue(newEndDateValue)
            }}
            renderInput={(params) => <TextField {...params} 
            disabled={!Boolean(startDateValue)}
            />}
            />

        <Select
        id="reportType"
        value={reportType}
        onChange={handleTypeChange}
        label="Report Type"
        disabled={Boolean(startDateValue)||Boolean(endDateValue)}
        >
            <MenuItem value="totalReport">Total Report
            </MenuItem>
            <MenuItem value="trendReport">Trend Report</MenuItem>
        </Select>
        <TotalReportDialog
        open={dialogOpen.totalReport}
        onClose={() => handleDialogClose('totalReport')}
        />
        <TrendReportDialog
        open={dialogOpen.trendReport}
        onClose={() => handleDialogClose('trendReport')}
        />
        <Button
        variant="contained"
        disabled={Boolean(startDateValue)||Boolean(endDateValue)}
        onClick={()=> handleDialogOpen(reportType)}
        >Open</Button>
        </Stack>
        </Box>


        </>
    )
};

export default Reports;
