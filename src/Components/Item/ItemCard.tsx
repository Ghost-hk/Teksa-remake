import type { Dispatch, FC, SetStateAction } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Post, Brand, Images, User } from "@prisma/client";

import { FiEdit } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";

interface ItemProps {
  item: Post & {
    user: User;
    images: Images[];
    brand: Brand[];
  };
  editAndDeleteBtns?: true;
  setIsDeletePopupOpen?: Dispatch<SetStateAction<boolean>>;
  setPostIdToDelete?: Dispatch<SetStateAction<string | null>>;
}

const ItemCard: FC<ItemProps> = ({
  item,
  editAndDeleteBtns,
  setIsDeletePopupOpen,
  setPostIdToDelete,
}) => {
  return (
    <div className="aspect-[1/0.5] w-full rounded-md bg-white shadow-md">
      {/* Img */}
      <div className="relative aspect-[1/1]  w-full">
        <Image
          src={`${item.images[0]?.imageUrl}`}
          alt="item Iamge"
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>

      {/* info */}
      <div className="p-3">
        <p className="truncate text-base text-gray-600 ">{item.title}</p>
        <div className=" ">
          <p className="truncate  text-sm text-gray-400">
            Brand: {item.brand[0]?.name}
          </p>
          <p className="truncate text-sm text-gray-400 ">Size: {item.size}</p>
        </div>
        <p className="py-2 text-sm font-semibold text-gray-600">
          {item.price} MAD
        </p>

        {editAndDeleteBtns ? (
          <div className=" flex w-full justify-between">
            <button
              className="flex items-center gap-1 text-violet-600 underline"
              onClick={() => {
                setIsDeletePopupOpen && setIsDeletePopupOpen(true);
                setPostIdToDelete && setPostIdToDelete(item.id);
              }}
            >
              Delete <FiTrash />
            </button>
            <Link
              href={`/item/update/${item.id}`}
              className="flex items-center gap-1 text-violet-600 underline"
            >
              Edit <FiEdit />
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <div
              className={`relative mr-2 h-7 w-7 overflow-hidden rounded-full bg-gray-400 ${
                !item.user.image && "flex items-center justify-center"
              }`}
            >
              {item.user.image ? (
                <Image src={item.user.image} fill alt="profile Img" />
              ) : (
                <span className="text-sm text-white">
                  {item.user.name?.split("")[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{item.user.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ItemCardSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-md border border-slate-400 shadow">
      <div className=" animate-pulse">
        <div className="aspect-[1/0.5] w-full  bg-slate-700"></div>
        <div className="p-3">
          <div className="h-4 w-full rounded-md bg-slate-700"></div>
          <div className="mt-1 h-2 w-[50%] rounded-md bg-slate-700"></div>
          <div className="mt-1 h-2 w-[40%] rounded-md bg-slate-700"></div>
          <div className="mt-2 h-3 w-[40%] rounded-md bg-slate-700"></div>
          <div className="mt-2 flex items-center">
            <div className="h-6 w-6 rounded-full bg-slate-700"></div>
            <div className="ml-2 h-2 w-[40%] rounded-md bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
