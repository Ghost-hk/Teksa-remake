import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { useEffect } from "react";

const ItemPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return;
  const { data: item, isLoading } = trpc.posts.getpostByItemId.useQuery({
    ItemId: +id,
  });

  return (
    <div className="mx-3 md:mx-6 lg:mx-9">
      {/* Loading */}
      {isLoading && <div>Loading ...</div>}

      {/* Item info */}
      {item && (
        <div className="w-full rounded-md bg-white shadow-md">
          <div className="flex">
            <div
              className={`relative mr-2 h-6 w-6 rounded-full bg-gray-400 ${
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
        </div>
      )}
    </div>
  );
};

export default ItemPage;
