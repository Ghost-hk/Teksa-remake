import Link from "next/link";
import { useRouter } from "next/router";
import ItemsComp from "../../Components/storePage/ItemsComp";

import { usePageStore } from "@/store/s_pagination";

const StorePage = () => {
  const router = useRouter();
  const { page } = router.query;

  const { currPage, prevPage, nextPage, numberOfPages } = usePageStore();

  return (
    <div className="mx-3 mt-5 justify-center md:mx-5 md:flex lg:mx-6">
      <div className="w-full justify-center gap-6 md:flex">
        {/* this is the filter section for desktop */}
        <div className="hidden w-72 rounded-md bg-white shadow-md md:block md:self-start">
          this is the filter seaction
        </div>

        {/* this is the mobile filter section */}
        <div className="block w-full md:hidden">
          this is the filter seaction for mobile
        </div>

        <div className="w-full md:max-w-2xl lg:max-w-4xl">
          {/* this is the posts */}
          <ItemsComp page={page ? (+page as number) : undefined} />

          {/* this is the pagination */}
          <div className="my-6 flex w-full items-center justify-center rounded-md bg-white p-4 shadow-md">
            <Link href={`/store?page=${prevPage}`}>prev</Link>

            <div className="mx-4 flex gap-3">
              {[...Array(numberOfPages)].map((x, i) => (
                <Link
                  href={`/store?page=${i + 1}`}
                  key={i}
                  className={i + 1 === currPage ? `text-red-500` : ""}
                >
                  {i + 1}
                </Link>
              ))}
            </div>

            <Link href={`/store?page=${nextPage}`}>next</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
