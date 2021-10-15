type CurrentHours = {
    createdAt?: Date | null;
    sundayHours?: HourRange | null;
    mondayHours?: HourRange | null;
    tuesdayHours?: HourRange | null;
    wednesdayHours?: HourRange | null;
    thursdayHours?: HourRange | null;
    fridayHours?: HourRange | null;
    saturdayHours?: HourRange | null;
}

type HourRange = {
    timeStart: Date;
    timeEnd: Date;
}

export type { CurrentHours, HourRange };