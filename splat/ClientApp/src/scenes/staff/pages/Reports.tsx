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
import DesktopDateRangePicker from '@mui/lab/DesktopDateRangePicker';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import FormControl from '@mui/material/FormControl';
import ItemsAddDialog from '../subcomponents/ItemsAddDialog';
import TotalReportDialog from '../subcomponents/TotalReportDialog';


interface ReportProps extends IStaffChild {
    
}

const Reports: FC<ReportProps> = (props: ReportProps): ReactElement => {
    
    const [dateValue, setDateValue] = React.useState<DateRange<Date>>([null, null]);
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <MobileDateRangePicker
                startText="Please select date range"
                value={dateValue}
                onChange={(newDateValue) => {
                    setDateValue(newDateValue);
                }}
                renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx = {{ mx:2}}> to </Box>
                        <TextField { ...endProps}/>
                    </React.Fragment>
                )}
                />
            </Stack>
        </LocalizationProvider>

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
        
        </>
    )
};

export default Reports;
