import type { Item } from './Item';
import type { Category } from './Category';

type ItemRequest = {
    item: Item;
    category?: Category | null;
    quantity: number;
};

export type { ItemRequest };

