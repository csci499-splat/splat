import React, { FC, ReactElement } from 'react';
import { TextField } from '@mui/material';
import { PickersDay, DatePicker, CalendarPickerSkeleton, 
     } from '@mui/lab';
import { baseRequest } from '../../services/api/genericRequest';

type DaySelectorProps = {
    value: Date;
    onChange: (newValue: Date | null) => void;
}

const DaySelector: FC<DaySelectorProps> = (props: DaySelectorProps): ReactElement => {

    const [isLoading, setIsLoading] = React.useState(false);
    const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);

    const fetchDisabledDays = async (date: Date) => {
        console.log(date);

        let res = await baseRequest.get<Date[]>('/hours/days');
        console.log(res.data);
        setDisabledDays(res.data);
        setIsLoading(false);
    };

    const handleMonthChange = (date: Date) => {
        setIsLoading(true);
        setDisabledDays([]);
        fetchDisabledDays(date);
    };

    const isDateDisabled = (date: Date): boolean => {
        console.log(date, disabledDays.indexOf(date));
        return disabledDays.includes(date);
    };

    React.useEffect(() => {
        fetchDisabledDays(new Date());
    }, []);

    return (
        <>
        <DatePicker
        value={props.value}
        loading={isLoading}
        onChange={props.onChange}
        onMonthChange={handleMonthChange}
        renderInput={(params) => <TextField {...params} />}
        renderLoading={() => <CalendarPickerSkeleton />}
        shouldDisableDate={isDateDisabled}
        minDate={new Date()}
        />
        </>
    )
};

export default DaySelector;
