import { type FC } from "react";
import ItemCard, { ItemCardSkeleton } from "../Item/ItemCard";

import type { Brand, Images, Post, User } from "@prisma/client";

interface ItemsCompProps {
  data:
    | {
        numberOfPages: number;
        posts: (Post & {
          user: User;
          images: Images[];
          brand: Brand[];
        })[];
      }
    | undefined;
  isLoading: boolean;
}

const ItemsComp: FC<ItemsCompProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div>
        <div className="grid w-full grid-cols-1 gap-5   md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((item, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid w-full grid-cols-1 gap-5   md:grid-cols-2 lg:grid-cols-3">
        {data?.posts &&
          data?.posts.map((item, index) => (
            <ItemCard item={item} key={index} />
          ))}
      </div>
    </div>
  );
};

export default ItemsComp;
