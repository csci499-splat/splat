import type { ItemRequest } from './ItemRequest';
import type { StudentInfo } from './StudentInfo';
import type { HouseholdInfo } from './HouseholdInfo';

export type History = {
    id: string | null;
    weight?: number;
    pickupStatus: HistoryStatus;
    pickupTime?: Date;
    canceledTime?: Date;
    submittedAt: Date | null;
    studentInfo: StudentInfo;
    householdInfo?: HouseholdInfo;
    itemRequests: ItemRequest[];
    requestedPickupTime: Date;
    otherNotes: string;
};

export enum HistoryStatus {
    PENDING = 0,
    WAITING = 1,
    DISBURSED = 2,
    CANCELED = 3,
};
