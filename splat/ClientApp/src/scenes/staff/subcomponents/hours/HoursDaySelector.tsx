import { Add, Delete } from '@mui/icons-material';
import { Button, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { FC, ReactElement } from 'react';
import { toast } from 'react-toastify';

import DaySelector from '../../../../components/common/DaySelector';

import type { ClosedDay } from '../../../../models/ClosedDay';
import axios from 'axios';

type HoursDaySelectorProps = {
    
};

const HoursDaySelector: FC<HoursDaySelectorProps> = (props: HoursDaySelectorProps): ReactElement => {

    const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);
    const [addDayOpen, setAddDayOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | null | undefined>(null);

    const retrieveDisabledDays = async () => {
        try {
            let res = await axios.get<ClosedDay[]>('/hours/days');
            setDisabledDays(res.data.map((item) => item.closedOn));
        } catch(error) { }
    };

    const handleRemoveDay = async (day: Date) => {
        await axios.delete(`/hours/days/${day.toISOString()}`);
        await retrieveDisabledDays();
    };

    const handleAddDay = async () => {
        if(selectedDate) {
            try {
                await axios.post('/hours/days', { closedOn: selectedDate });
                handleDayClose();
                await retrieveDisabledDays();
            } catch (error) {
                
            }
        } else {
            toast.error(`Date must be present`, {
                position: 'top-center',
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: 0,
            });
        }
        
    };

    const handleDayClose = () => {
        setSelectedDate(null);
        setAddDayOpen(false);
    };

    React.useEffect(() => {
        retrieveDisabledDays();
    }, []);

    return (
        <>
        <Stack direction="column-reverse">
        <TableContainer sx={{width: '200px', height: '300px'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Date</TableCell>
                        <TableCell align="center">Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {disabledDays.map((day: Date, index) => {
                        return (
                        <TableRow key={index}>
                            <TableCell align="left" key={index}>{new Date(day).toLocaleDateString()}</TableCell>
                            <TableCell align="center">
                                <IconButton
                                onClick={() => handleRemoveDay(new Date(day))}
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
        </TableContainer>
        <div>
        { !addDayOpen ? (
            <Button
            onClick={() => setAddDayOpen(true)}
            startIcon={<Add />}
            variant="contained"
            color="primary"
            >
                Add Closed Day
            </Button>
        ) : (
            <>
            <Stack direction="column" spacing={2}>
                <DaySelector
                // @ts-ignore
                value={selectedDate}
                onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                />
                <Stack direction="row" spacing={2}>
                    <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDayClose()}
                    sx={{height: '40px', mb: 1, width: '50%'}}
                    >
                        Cancel
                    </Button>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddDay()}
                    sx={{height: '40px', mb: 1, width: '50%'}}
                    >
                        Add
                    </Button>
                </Stack>
            </Stack>
            </>
        )}
        </div>
        </Stack>
        </>
    )
};

export default HoursDaySelector;
