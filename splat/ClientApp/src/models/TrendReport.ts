import type { Item } from './Item';

export type TrendEntry = {
    item: Item;
    requestCount: number;
};

export type TrendReport = {
    entries: TrendEntry[];
};
