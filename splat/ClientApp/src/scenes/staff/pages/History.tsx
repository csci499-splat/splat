import { CancelOutlined, Done, Outbound, Visibility } from '@mui/icons-material';
import { DatePicker, LocalizationProvider} from '@mui/lab';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Button, IconButton, Tooltip, TextField } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowData,
    GridSortModel,
    GridToolbar,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { FC, ReactElement, useState } from 'react';

import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { baseRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import  HistoryTable  from '../subcomponents/HistoryTable';

interface HistoryProps extends IStaffChild {
    
}

export interface IHistoryRow extends GridRowData, Pickup {
    
};

export interface IHistoryDialogProps {
    selectedPickup?: IHistoryRow;
    open: boolean;
    onClose: () => void;
};

const History: FC<HistoryProps> = (props: HistoryProps): ReactElement => {

    const [startDateValue, setStartDateValue] = React.useState<Date | null>();
    const [endDateValue, setEndDateValue] = React.useState<Date | null>();
    const [dialogOpen, setDialogOpen] = useState({HistoryTable: false});


    const handleDialogOpen = (dialog: 'HistoryTable'|'') => {
        setDialogOpen((prevState) => ({ ... prevState, [dialog]: true}));
        
    };
    const handleDialogClose = (dialog: 'HistoryTable'|'') => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: false}))
    };

    return (
        <>
        <Box
        sx={{
            textAlign: 'center',
            left: '30%',
          }}
        >

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
        
        <Button
        variant="contained"
        disabled={!(Boolean(startDateValue)||Boolean(endDateValue))}
        onClick={()=> handleDialogOpen('HistoryTable')}
        >Open</Button>
        </Stack>
        </Box>
        <HistoryTable
        open={dialogOpen.HistoryTable}
        onClose={() => handleDialogClose('HistoryTable')}
        />

        </>
    )
};

export default History;