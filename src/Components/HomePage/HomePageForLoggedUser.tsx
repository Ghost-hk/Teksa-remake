import Link from "next/link";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const sm = 640;
const md = 768;
const lg = 1024;
const xl = 1280;

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

const HomePageForLoggedUser = () => {
  // Window Size Stuff
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [numberOfItems, setNumberOfItems] = useState<number>(4);
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (windowSize.innerWidth < sm) {
      setNumberOfItems(4);
    } else if (windowSize.innerWidth < md) {
      setNumberOfItems(4);
    } else if (windowSize.innerWidth < lg) {
      setNumberOfItems(6);
    } else if (windowSize.innerWidth < xl) {
      setNumberOfItems(8);
    } else {
      setNumberOfItems(6);
    }
  }, [windowSize.innerWidth]);

  const { data, isLoading } = trpc.posts.getposts.useQuery({
    userId: 1,
  });

  console.log(data);

  return (
    <>
      {/* New items Seaction */}
      <div className="mx-3 mt-6 md:mx-6 lg:mx-9">
        {/* New Items & View All */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-gray-800 xl:text-lg">New Items</h2>
          <Link className="text-sm text-violet-600 underline" href="#">
            View All
          </Link>
        </div>

        {/* The Items Container */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data &&
              data.map((item, ind) => {
                return ind < numberOfItems ? (
                  <div key={ind} className="h-80 w-full bg-teal-500">
                    {item.title}
                  </div>
                ) : null;
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePageForLoggedUser;
