import React, { FC, ReactElement } from 'react';
import { TextField } from '@mui/material';
import { PickersDay, DatePicker, CalendarPickerSkeleton, 
     } from '@mui/lab';
import { baseRequest } from '../../services/api/genericRequest';
import { ClosedDay } from '../../models/ClosedDay';
import moment from 'moment';

type DaySelectorProps = {
    value: Date | null;
    onChange: (newValue: Date | null) => void;
    error?: boolean;
    helperText?: string;
}

const DaySelector: FC<DaySelectorProps> = (props: DaySelectorProps): ReactElement => {

    const [isLoading, setIsLoading] = React.useState(false);
    const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);

    const fetchDisabledDays = async () => {
        let res = await baseRequest.get<ClosedDay[]>('/hours/days');
        setDisabledDays(res.data.map((item) => new Date(item.closedOn)));
        setIsLoading(false);
    };

    const handleMonthChange = (date: Date) => {
        setIsLoading(true);
        setDisabledDays([]);
        fetchDisabledDays();
    };

    React.useEffect(() => {
        fetchDisabledDays();
    }, []);

    return (
        <>
        <DatePicker
        value={props.value}
        onChange={props.onChange}
        loading={isLoading}
        onMonthChange={handleMonthChange}
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
            let isDisabled = moment(date).isBefore(new Date(), 'day');
            
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
        </>
    )
};

export default DaySelector;
