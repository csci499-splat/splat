import Category from './Category';

type Item = {
    id: string;
    name: string;
    category: Category;
    description: string;
    visible: boolean;
    createdAt: string;
};

export default Item;
