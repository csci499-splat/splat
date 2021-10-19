import type { ItemRequest } from './ItemRequest';
import type { StudentInfo } from './StudentInfo';
import type { HouseholdInfo } from './HouseholdInfo';

export type Pickup = {
    id: string | null;
    weight?: number;
    pickupStatus: PickupStatus;
    pickupTime?: Date;
    canceledTime?: Date;
    submittedAt: Date | null;
    studentInfo: StudentInfo;
    householdInfo?: HouseholdInfo;
    itemRequests: ItemRequest[];
    requestedPickupTime: Date;
    otherNotes: string;
};

export enum PickupStatus {
    PENDING = 0,
    WAITING = 1,
    DISBURSED = 2,
    CANCELED = 3,
};
