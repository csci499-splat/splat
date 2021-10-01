import Category from './Category';

type Item = {
    id: string | null;
    name: string;
    category: Category;
    description: string;
    visible: boolean;
    createdAt: string | null;
};

export default Item;
