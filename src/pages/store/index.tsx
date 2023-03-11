import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ItemCard from "../../Components/Item/ItemCard";
import { trpc } from "../../utils/trpc";

const StorePage = () => {
  const router = useRouter();
  const { page } = router.query;

  console.log("page", page);

  const [currPage, setCurrPage] = useState<number | undefined>(
    page ? (+page as number) : undefined
  );
  const [nextPage, setNextPage] = useState<number | undefined>(
    currPage ? currPage + 1 : undefined
  );
  const [prevPage, setPrevPage] = useState<number | undefined>(
    currPage ? currPage - 1 : undefined
  );

  const { data, isLoading } = trpc.posts.paginatedPosts.useQuery(
    { currPage: currPage as number },
    { refetchOnWindowFocus: false, enabled: !!currPage }
  );

  useEffect(() => {
    setCurrPage(page ? (+page as number) : undefined);
    if (page && +page === 0) {
      router.push("/store?page=1");
      setCurrPage(1);
      setNextPage(2);
    }

    if (data?.numberOfPages && currPage && currPage < data?.numberOfPages) {
      setNextPage(currPage + 1);
    }

    if (currPage && currPage > 0) {
      setPrevPage(currPage - 1);
    }
  }, [
    currPage,
    page,
    setCurrPage,
    setNextPage,
    setPrevPage,
    data?.numberOfPages,
  ]);

  console.log("currPage: ", currPage);
  console.log("Next: ", nextPage);
  console.log("Prev: ", prevPage);
  console.log("Number of pages: ", data?.numberOfPages);
  console.log("-----------------------");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-3 mt-5 md:mx-5 lg:mx-6">
      <div className="w-full gap-6 bg-red-400 md:flex">
        <div className="hidden max-w-xs bg-yellow-400 md:block md:self-start">
          this is the filter seaction
        </div>
        <div className="block w-full bg-yellow-400  md:hidden">
          this is the filter seaction for mobile
        </div>
        <div className="w-full bg-indigo-400 ">
          {data?.posts &&
            data?.posts.map((item, index) => (
              <ItemCard item={item} key={index} />
            ))}
        </div>

        <div className="bg-indigo-500">
          <Link href={`/store?page=${nextPage}`}>next</Link>

          <div>
            {[...Array(data?.numberOfPages)].map((x, i) => (
              <Link href={`/store?page=${i + 1}`} key={i}>
                {i + 1}
              </Link>
            ))}
          </div>

          <Link href={`/store?page=${prevPage}`}>prev</Link>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
