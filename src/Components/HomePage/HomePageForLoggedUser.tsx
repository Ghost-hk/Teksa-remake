import Link from "next/link";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";

import ItemCard, { ItemCardSkeleton } from "../Item/ItemCard";

const sm = 640;
const md = 768;
const lg = 1024;
const xl = 1280;

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

const HomePageForLoggedUser = () => {
  // const router = useRouter();
  // Window Size Stuff
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [numberOfItems, setNumberOfItems] = useState<number>(4);
  const [numberOfBrands, setNumberOfBrands] = useState<number>(9);
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
      setNumberOfBrands(9);
    } else if (windowSize.innerWidth < md) {
      setNumberOfItems(4);
      setNumberOfBrands(9);
    } else if (windowSize.innerWidth < lg) {
      setNumberOfItems(3);
      setNumberOfBrands(12);
    } else if (windowSize.innerWidth < xl) {
      setNumberOfItems(8);
      setNumberOfBrands(16);
    } else {
      setNumberOfItems(6);
      setNumberOfBrands(12);
    }
  }, [windowSize.innerWidth]);

  const { data, isLoading } = trpc.posts.getAllPosts.useQuery({
    numberOfPosts: numberOfItems,
  });

  const brands = [
    "adidas",
    "nike",
    "Reebok",
    "Vans",
    "NewBalance",
    "ZARA",
    "H&M",
    "gucci",
    "chanel",
    "dolceGabbana",
    "levis",
    "lacoste",
    "underArmour",
    "Supreme",
    "AirJordan",
    "Champion",
  ];

  return (
    <div className="mx-3 md:mx-6 lg:mx-9">
      {/* New items Seaction */}
      <div className="mt-6">
        {/* New Items & View All */}
        <div className="mb-2 flex justify-between">
          <h2 className="font-semibold text-gray-800 xl:text-lg">New Items</h2>
          <Link className="text-sm text-violet-600 underline" href="#">
            View All
          </Link>
        </div>

        {/* The Items Container */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: numberOfItems }).map((_, ind) => {
              return <ItemCardSkeleton key={ind} />;
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data &&
              data.map((item, ind) => {
                return ind < numberOfItems ? (
                  <div
                    key={ind}
                    // onClick={() => router.push(`store/${item.id}`)}
                  >
                    <ItemCard item={item} />
                  </div>
                ) : null;
              })}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mt-10 mb-10">
        <div className="mb-2 flex justify-between">
          <h2 className="font-semibold text-gray-800 xl:text-lg">Brands</h2>
          <Link className="text-sm text-violet-600 underline" href="#">
            View All
          </Link>
        </div>

        {/* Brands Grid */}
        <div className=" grid grid-cols-3 justify-center gap-x-3 gap-y-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 ">
          {brands.map((brand, ind) => {
            return ind < numberOfBrands ? (
              <div
                className="relative aspect-square cursor-pointer  overflow-hidden rounded-md border-2 border-slate-400 bg-white shadow-sm"
                key={ind}
              >
                <Image
                  src={`/BrandsLogos/${brand}.png`}
                  alt={`${brand} Logo`}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* My Likes */}
      <div className="mt-10 mb-10">
        <div className="mb-2 flex justify-between">
          <h2 className="font-semibold text-gray-800 xl:text-lg">My Likes</h2>
          <Link className="text-sm text-violet-600 underline" href="#">
            View All
          </Link>
        </div>

        {false ? null : ( // add logic for liked items
          <div className="flex justify-center">
            <div className="inline-block rounded-md border border-slate-400 bg-white shadow-md">
              <p className="py-3 px-5 text-center text-sm text-gray-600 md:text-base">
                No liked Items yet, Like items to save them for later.
                <Link href="#" className="block text-violet-600 underline">
                  Discover Now!
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent views */}
      <div className="mt-10 mb-10">
        <div className="mb-2 flex justify-between">
          <h2 className="font-semibold text-gray-800 xl:text-lg">
            Recent Views
          </h2>
          <Link className="text-sm text-violet-600 underline" href="#">
            View All
          </Link>
        </div>

        {false ? null : ( // add logic for liked items
          <div className="flex justify-center ">
            <div className="inline-block rounded-md border border-slate-400 bg-white shadow-md">
              <p className="py-3 px-5 text-center text-sm text-gray-600 md:text-base">
                No viewed Items yet, What are you waiting for?
                <Link href="#" className="block text-violet-600 underline">
                  Discover Now!
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePageForLoggedUser;
