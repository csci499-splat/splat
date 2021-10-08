type Donation = {
    id: string | null;
    monetaryValue?: number;
    weight?: number;
    donor: string;
    donatedAt: string | Date;
};

export type { Donation };
