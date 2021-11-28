import { CalendarPickerSkeleton, DatePicker, PickersDay, TimePicker } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import moment from 'moment';
import React, { FC, ReactElement } from 'react';

import { ClosedDay } from '../../models/ClosedDay';
import { CurrentHours, HourRange } from '../../models/CurrentHours';
import { baseRequest } from '../../services/api/genericRequest';

type DateVal = {
    date: Date | null;
    time: Date | null;
};

type PickupDateTimeSelectorProps = {
    value: DateVal;
    onChange: (newValue: DateVal) => void;
    onHoursChange: (newHours: HourRange) => void;
    error?: boolean;
    helperText?: string;
}

const PickupDateTimeSelector: FC<PickupDateTimeSelectorProps> = (props: PickupDateTimeSelectorProps): ReactElement => {

    const [isLoading, setIsLoading] = React.useState(false);
    const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);
    const [currentHours, setCurrentHours] = React.useState<HourRange>(
        {timeStart: new Date(0, 0, 0, 0, 0), timeEnd: new Date(0, 0, 0, 23, 59)});

    const fetchDisabledDays = async () => {
        setIsLoading(true);
        try {
            let res = await baseRequest.get<ClosedDay[]>('/hours/days');
            setDisabledDays(res.data.map((item) => new Date(item.closedOn)));
            setIsLoading(false);
        } catch(err) {

        }
    };

    const fetchCurrentHours = async () => {
        try {
            let res = await baseRequest.get<CurrentHours>('/hours');
            delete res.data.createdAt;

            if(props.value.date) {
                let key = Object.keys(res.data)[props.value.date.getDay()];
                setCurrentHours({ timeStart: new Date(res.data[key].timeStart), timeEnd: new Date(res.data[key].timeEnd) });
                props.onHoursChange({ timeStart: new Date(res.data[key].timeStart), timeEnd: new Date(res.data[key].timeEnd) });
            } else {
                setCurrentHours({timeStart: new Date(0, 0, 0, 0, 0), timeEnd: new Date(0, 0, 0, 23, 59)});
            }
        } catch(err) {
            
        }
    };

    React.useEffect(() => {
        fetchDisabledDays();
    }, []);

    React.useEffect(() => {
        fetchCurrentHours();
    }, [props.value.date]);

    return (
        <>
        <Stack direction="row" spacing={2} alignItems="flex-end">
        <DatePicker
        value={props.value.date}
        onChange={(newDate) => props.onChange({...props.value, date: newDate})}
        loading={isLoading}
        renderInput={(params) => 
            <TextField 
            {...params}
            error={props.error}
            helperText={props.helperText}
            variant="standard"
            />
        }
        renderLoading={() => <CalendarPickerSkeleton />}
        renderDay={(date, _value, DayComponentProps) => {
            let isDisabled = moment(date).isBefore(new Date(), 'day') || moment(date).isAfter(new Date( Date.now() + (6.048e+8 * 2) ), 'day');
            
            disabledDays.forEach(day => {
                if(moment(day).isSame(date, 'day')) {
                    isDisabled = true;
                }
            });
            
            return (
                <PickersDay 
                {...DayComponentProps} 
                disabled={isDisabled}
                />
            )
        }}
        />
        <TimePicker
        {...props}
        value={props.value.time}
        onChange={(newDate) => props.onChange({...props.value, time: newDate})}
        renderInput={(params) => 
            <TextField
            {...params}
            error={props.error}
            helperText={props.helperText}
            variant="standard"
            />
        }
        label="Time"
        minTime={currentHours.timeStart}
        maxTime={currentHours.timeEnd}
        />
        </Stack>
        </>
    )
};

export default PickupDateTimeSelector;
