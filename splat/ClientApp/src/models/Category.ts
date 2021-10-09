type Category = {
    id: string | null | undefined;
    name: string;
    limit: number;
    icon: string;
    description: string;
    visible: boolean;
    createdAt: string | null | Date;
};

export type { Category };
