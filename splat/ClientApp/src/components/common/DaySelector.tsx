import { CalendarPickerSkeleton, DatePicker, PickersDay } from '@mui/lab';
import { TextField } from '@mui/material';
import moment from 'moment';
import React, { FC, ReactElement } from 'react';

import { ClosedDay } from '../../models/ClosedDay';
import { baseRequest } from '../../services/api/genericRequest';

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
        setIsLoading(true);
        let res = await baseRequest.get<ClosedDay[]>('/hours/days');
        setDisabledDays(res.data.map((item) => new Date(item.closedOn)));
        setIsLoading(false);
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
