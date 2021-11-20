import React, { FC, ReactElement } from 'react';
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { IStaffChild } from '../Staff';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import TotalReportDialog from '../subcomponents/TotalReportDialog';
import TrendReportDialog from '../subcomponents/TrendReportDialog';
import { Category } from '../../../models/BackendTypes';

interface ReportProps extends IStaffChild {
    
}

type DialogType = 'totalReport' | 'trendReport' | '';

const Reports: FC<ReportProps> = (props: ReportProps): ReactElement => {
    
    const [startDateValue, setStartDateValue] = React.useState<Date | null>();
    const [endDateValue, setEndDateValue] = React.useState<Date | null>();
    //TODO Create a new type, if user want to add new report type, they don't need to change 3 lines. 
    const [reportType, setReportType] = React.useState<DialogType>('');
    const [dialogOpen, setDialogOpen] = useState({totalReport: false, trendReport: false});
    

    const handleDialogOpen = (dialog: DialogType) => {
        setDialogOpen((prevState) => ({ ... prevState, [dialog]: true}));
        
    };
    const handleDialogClose = (dialog: DialogType) => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: false}))
    };
    const handleTypeChange = (event: SelectChangeEvent) => {
        setReportType(event.target.value as DialogType);
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
        <Stack direction="row" spacing={2}  >

        <MobileDatePicker
            label="Select start date"
            value={startDateValue}
            maxDate={(endDateValue) ? endDateValue : new Date()}
            onChange={(newStartDateValue) => {
                setStartDateValue(newStartDateValue)
            }}
            renderInput={(params) => <TextField {...params} />}
            />
            <Box sx = {{alignItems: 'center',fontSize: 21}}> To </Box>
            <MobileDatePicker
            label="Select end date"
            value={endDateValue}
            minDate={startDateValue}
            
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
        sx={{ minWidth: 70 }}
        disabled={!(Boolean(startDateValue) || Boolean(endDateValue))}
        >
            <MenuItem value="" disabled><em>None</em></MenuItem>
            <MenuItem value="totalReport">Total</MenuItem>
            <MenuItem value="trendReport">Trend</MenuItem>
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
        disabled={!Boolean(startDateValue) || !Boolean(endDateValue) || !Boolean(reportType)}
        onClick={()=> handleDialogOpen(reportType)}
        >Open</Button>
        </Stack>
        </Box>


        </>
    )
};

export default Reports;
