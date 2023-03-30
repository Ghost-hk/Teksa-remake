import router from "next/router";
import { type FC, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import ItemCard, { ItemCardSkeleton } from "../Item/ItemCard";

import { usePageStore } from "@/store/s_pagination";

interface ItemsCompProps {
  page: number | undefined;
}

const ItemsComp: FC<ItemsCompProps> = ({ page }) => {
  const { currPage, setCurrPage, setNextPage, setPrevPage, setNumberOfPages } =
    usePageStore();

  const { data, isLoading } = trpc.posts.paginatedPosts.useQuery(
    { currPage: currPage as number },
    { refetchOnWindowFocus: false, enabled: !!currPage }
  );

  useEffect(() => {
    if (data?.numberOfPages) {
      setNumberOfPages(data.numberOfPages);
    }
  }, [data?.numberOfPages, setNumberOfPages]);

  useEffect(() => {
    // if (!page) return;

    setCurrPage(page ? (+page as number) : undefined);
    if (page && +page === 0) {
      router.push("/store?page=1");
      setCurrPage(1);
      setNextPage(2);
      setPrevPage(1);
    }

    if (data?.numberOfPages && currPage && currPage < data?.numberOfPages) {
      setNextPage(currPage + 1);
    }

    if (currPage && currPage >= 1) {
      if (currPage === 1) {
        setPrevPage(currPage);
      } else {
        setPrevPage(currPage - 1);
      }
    }
  }, [
    currPage,
    page,
    setCurrPage,
    setNextPage,
    setPrevPage,
    data?.numberOfPages,
  ]);

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
