import type { ItemRequest } from './ItemRequest';
import type { StudentInfo } from './StudentInfo';
import type { HouseholdInfo } from './HouseholdInfo';

export type Pickup = {
    id: string | null;
    weight?: number;
    pickupStatus: PickupStatus;
    pickupTime?: string;
    canceledTime?: string;
    submittedAt: string | null;
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

export const getStatusString = (status: PickupStatus | undefined): string => {
    switch(status) {
        case PickupStatus.PENDING:
            return "Pending fulfillment";
        case PickupStatus.WAITING:
            return "Waiting for pickup";
        case PickupStatus.DISBURSED:
            return "Disbursed to student";
        case PickupStatus.CANCELED:
            return "Canceled";
        default:
            return "None";
    }
};
