import Link from "next/link";
import { useRouter } from "next/router";
import ItemsComp from "../../Components/storePage/ItemsComp";

import { usePageStore } from "@/store/s_pagination";
import Filters from "@/Components/storePage/Filters";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";

import { usePagination } from "@mantine/hooks";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/utils/trpc";

const StorePage = () => {
  const { currPage, numberOfPages, setNumberOfPages, setCurrPage } =
    usePageStore();

  const [page, onChange] = useState<number>(1);
  const pagination = usePagination({
    total: numberOfPages as number,
    page,
    onChange,
  });

  const [filters, setFilters] = useState<
    | {
        brand: string[] | undefined;
        sexe: string[] | undefined;
        category: string[] | undefined;
        price: number | undefined;
        size: string[] | undefined;
      }
    | undefined
  >();
  console.log("this is form the fe", filters);

  const { data, isLoading } = trpc.posts.paginatedPosts.useQuery(
    { currPage: currPage as number, filters },
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
      // router.push("/store?page=1");
      setCurrPage(1);
    }
  }, [currPage, page, setCurrPage, data?.numberOfPages]);

  return (
    <div className="mx-3 mt-5 justify-center md:mx-5 md:flex lg:mx-6">
      <div className="w-full justify-center gap-6 md:flex">
        {/* this is the filter section for desktop */}
        <div className="hidden w-72 rounded-md bg-white shadow-md md:block md:self-start">
          <Filters setFilters={setFilters} />
        </div>

        {/* this is the mobile filter section */}
        <div className="mb-4 flex w-full justify-end md:hidden ">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center rounded-md bg-white px-3 py-1 font-semibold text-gray-800 shadow-md">
                Filters
                <SlidersHorizontal className="ml-2" size={22} />
              </button>
            </SheetTrigger>

            <SheetContent position="right" size="xl">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Add filters to find exactly what you need.
                </SheetDescription>
              </SheetHeader>
              <div className="h-full  w-full bg-indigo-400">This is cool</div>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="w-full md:max-w-2xl lg:max-w-4xl">
          {/* this is the posts */}
          <ItemsComp data={data} isLoading={isLoading} />

          {/* this is the pagination */}
          <div className="my-6 flex w-full items-center justify-center rounded-md bg-white p-4 shadow-md">
            {/* <Link href={`/store?page=${prevPage}`}>prev</Link>
             */}
            <button
              onClick={() => {
                pagination.previous();
                // router.push(`/store?page=${page}`);
              }}
            >
              <ChevronLeft />
            </button>

            <div className="mx-4 flex gap-3">
              {pagination.range.map((page) =>
                typeof page === "number" ? (
                  <button
                    // href={`/store?page=${i + 1}`}
                    onClick={() => pagination.setPage(page)}
                    key={page}
                    className={`rounded-md border border-violet-600 px-2 py-1 ${
                      page === currPage ? `bg-violet-600 text-white` : ""
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  "..."
                )
              )}
              {/* {} */}
            </div>

            {/* <Link href={`/store?page=${nextPage}`}>next</Link> */}
            <button
              onClick={() => {
                pagination.next();
                // router.push(`/store?page=${page}`);
              }}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
