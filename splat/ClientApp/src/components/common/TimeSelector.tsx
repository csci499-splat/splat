import React, { FC, ReactElement } from 'react';
import { TextField } from '@mui/material';
import { TimePicker, 
     } from '@mui/lab';
import { baseRequest } from '../../services/api/genericRequest';
import { ClosedDay } from '../../models/ClosedDay';
import moment from 'moment';
import { CurrentHours, HourRange } from '../../models/CurrentHours';

type TimeSelectorProps = {
    value: Date | null;
    onChange: (newValue: Date | null) => void;
    selectedDate: Date | null;
}

const TimeSelector: FC<TimeSelectorProps> = (props: TimeSelectorProps): ReactElement => {

    const [currentHours, setCurrentHours] = React.useState<HourRange>(
        {timeStart: new Date(0, 0, 0, 0), timeEnd: new Date(0, 0, 0, 23, 59)});

    const fetchCurrentHours = async () => {
        let res = await baseRequest.get<CurrentHours>('/hours');
        delete res.data.createdAt;

        if(props.selectedDate) {
            let key = Object.keys(res.data)[props.selectedDate.getDay()];
            setCurrentHours(res.data[key]);
        } else {
            setCurrentHours({timeStart: new Date(0, 0, 0, 0), timeEnd: new Date(0, 0, 0, 23, 59)});
        }
    };

    React.useEffect(() => {
        fetchCurrentHours();
    }, []);

    return (
        <>
        <TimePicker
        {...props}
        value={props.value}
        onChange={props.onChange}
        renderInput={(params) => <TextField {...params} />}
        label="Time"
        minTime={currentHours.timeStart}
        maxTime={currentHours.timeEnd}
        />
        </>
    )
};

export default TimeSelector;
