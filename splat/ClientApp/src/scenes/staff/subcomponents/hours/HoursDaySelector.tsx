import React, { FC, ReactElement } from 'react';
import { TableContainer, Table, TableRow, TableHead, TableBody, TableCell,
    Button, IconButton, TextField, Stack } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { baseRequest } from '../../../../services/api/genericRequest';
import DaySelector from '../../../../components/common/DaySelector';
import type { ClosedDay } from '../../../../models/ClosedDay';

type HoursDaySelectorProps = {
    
};

const HoursDaySelector: FC<HoursDaySelectorProps> = (props: HoursDaySelectorProps): ReactElement => {

    const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);
    const [addDayOpen, setAddDayOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

    const retrieveDisabledDays = async () => {
        let res = await baseRequest.get<ClosedDay[]>('/hours/days');
        setDisabledDays(res.data.map((item) => item.closedOn));
    };

    const handleRemoveDay = async (day: Date) => {
        await baseRequest.delete(`/hours/days/${day.toISOString()}`);
        retrieveDisabledDays();
    };

    const handleAddDay = async () => {
        await baseRequest.post('/hours/days', { closedOn: selectedDate });
        handleDayClose();
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
        <Stack direction="row">
        <TableContainer sx={{width: '200px', height: '400px'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Date</TableCell>
                        <TableCell align="center">Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {disabledDays.map((day: Date, index) => {
                        console.log(new Date(day).toLocaleDateString());
                        return (
                        <TableRow>
                            <TableCell align="left" key={index}>{new Date(day).toLocaleDateString()}</TableCell>
                            <TableCell align="center">
                                <IconButton
                                onClick={() => handleRemoveDay(day)}
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
        </TableContainer>
        <div style={{height: 200}}>
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
            <DaySelector
            // @ts-ignore
            value={selectedDate}
            onChange={(newValue: Date | null) => setSelectedDate(newValue)}
            />
            <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDayClose()}
            />
            <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddDay()}
            />
            </>
        )}
        </div>
        </Stack>
        </>
    )
};

export default HoursDaySelector;
