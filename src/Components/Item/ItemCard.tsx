import { FC } from "react";

interface ItemProps {
  title: string;
  description: string;
  price: number;
  image: string;
  id: number;
  brand: string[];
  category: string[];
  sexe: string;
  size: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const ItemCard: FC<ItemProps> = ({}) => {
  return <div>Item</div>;
};

export default ItemCard;
