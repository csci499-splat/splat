import type { Item } from './Item';
import type {Category} from './Category'

export type TrendReport = {
    entries: TrendEntry[];
};

export type TrendEntry = {
    category:Category;
    trendItemEntries: TrendItemEntry[];
};

export type TrendItemEntry = {
    item: Item;
    requestBin: RequestHistoryBin[];
    average: number;
};


export type RequestHistoryBin = {
    requestCount: number;
    binTime: DateRange;
};

export type DateRange = {
    startDate: Date;
    endDate: Date;      
};
