type CurrentHours = {
    createdAt?: Date | null;
    sundayHours?: HourRange;
    mondayHours?: HourRange;
    tuesdayHours?: HourRange;
    wednesdayHours?: HourRange;
    thursdayHours?: HourRange;
    fridayHours?: HourRange;
    saturdayHours?: HourRange;
}

type HourRange = {
    timeStart: Date;
    timeEnd: Date;
}

export type { CurrentHours, HourRange };