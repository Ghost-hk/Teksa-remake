import Link from "next/link";

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const HomePageForLoggedUser = () => {
  return (
    <>
      {/* New items Seaction */}
      <div className="mt-6 px-3">
        {/* New Items & View All */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-gray-800 xl:text-lg">New Items</h2>
          <Link className="text-sm text-violet-600 underline" href="#">
            View All
          </Link>
        </div>

        {/* The Items Container */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {data.map((item, ind) => {
            return ind < 4 ? (
              <div key={ind} className="h-80 w-full bg-teal-500">
                Item number:{item}
              </div>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
};

export default HomePageForLoggedUser;
