import { trpc } from "@/utils/trpc";
import { Dispatch, SetStateAction, FC, useState, ChangeEvent } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";

import { Slider } from "@/Components/ui/slider";

interface FiltersProps {
  setFilters: Dispatch<
    SetStateAction<
      | {
          brand: string[] | undefined;
          sexe: string[] | undefined;
          category: string[] | undefined;
          price: number | undefined;
          size: string[] | undefined;
        }
      | undefined
    >
  >;
}

const Filters: FC<FiltersProps> = ({ setFilters }) => {
  const { data: categories } = trpc.posts.getAllCategories.useQuery(
    { inp: "woow" },
    { refetchOnWindowFocus: false }
  );
  const { data: brands } = trpc.posts.getAllBrands.useQuery(
    { inp: "woow" },
    { refetchOnWindowFocus: false }
  );
  const [activeFilters, setActiveFilters] = useState<{
    brand: string[] | undefined;
    sexe: string[] | undefined;
    category: string[] | undefined;
    price: number | undefined;
    size: string[] | undefined;
  }>({
    brand: undefined,
    sexe: undefined,
    category: undefined,
    price: undefined,
    size: undefined,
  });

  const handleCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>,
    val: "brand" | "sexe" | "category" | "size"
  ) => {
    e.target.checked
      ? setActiveFilters((prev) => ({
          ...prev,
          [val]: [...(prev[val] ?? []), e.target.name],
        }))
      : setActiveFilters((prev) => {
          const updatedVal = (prev[val] ?? []).filter(
            (v: string) => v !== e.target.name
          );
          return {
            ...prev,
            [val]: updatedVal.length > 0 ? updatedVal : undefined,
          };
        });
  };

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  // console.log(activeFilters);

  const creatTheFilterForPrisma = () => {
    setFilters(activeFilters);
  };

  return (
    <div>
      <div className="w-full bg-white ">
        <div className="px-2 py-4 text-sm">
          <p className="text-lg font-semibold uppercase text-gray-800">
            Filters
          </p>
          <div className="my-2">
            <p className="mb-2">
              Max Price: {activeFilters["price"] ? activeFilters["price"] : 0}
            </p>
            <Slider
              defaultValue={[0]}
              max={1000}
              onValueChange={(value) =>
                setActiveFilters((prev) => ({
                  ...prev,
                  ["price"]: value[0] as number,
                }))
              }
              step={10}
              className="px-4"
            />
          </div>
          <Accordion type="multiple">
            <AccordionItem value="categories">
              <AccordionTrigger>
                <span>Categories</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex flex-col gap-2">
                  {categories?.map((category) => (
                    <div className="mr-4 flex items-center" key={category.id}>
                      <input
                        id={category.id}
                        type="checkbox"
                        name={category.name}
                        checked={
                          activeFilters.category?.includes(category.name)
                            ? true
                            : false
                        }
                        onChange={(e) => handleCheckBox(e, "category")}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 ring-0 focus:ring-purple-500"
                      />
                      <label
                        htmlFor={category.id}
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brands">
              <AccordionTrigger>Brandes</AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex flex-col gap-2">
                  {brands?.map((brand) => (
                    <div className="mr-4 flex items-center" key={brand.id}>
                      <input
                        id={brand.id}
                        type="checkbox"
                        name={brand.name}
                        checked={
                          activeFilters.brand?.includes(brand.name)
                            ? true
                            : false
                        }
                        onChange={(e) => handleCheckBox(e, "brand")}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 ring-0 focus:ring-purple-500"
                      />
                      <label
                        htmlFor={brand.id}
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sizes">
              <AccordionTrigger>Size</AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex flex-col gap-2">
                  {sizes?.map((size) => (
                    <div className="mr-4 flex items-center" key={size}>
                      <input
                        id={size}
                        type="checkbox"
                        name={size}
                        checked={
                          activeFilters.size?.includes(size) ? true : false
                        }
                        onChange={(e) => handleCheckBox(e, "size")}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 ring-0 focus:ring-purple-500"
                      />
                      <label
                        htmlFor={size}
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gender">
              <AccordionTrigger>Gender</AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex flex-col gap-2">
                  <div className="mr-4 flex items-center">
                    <input
                      id="male"
                      type="checkbox"
                      name="Male"
                      checked={
                        activeFilters.sexe?.includes("Male") ? true : false
                      }
                      onChange={(e) => handleCheckBox(e, "sexe")}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 ring-0 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="male"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Male
                    </label>
                  </div>
                  <div className="mr-4 flex items-center">
                    <input
                      id="female"
                      type="checkbox"
                      name="Female"
                      checked={
                        activeFilters.sexe?.includes("Female") ? true : false
                      }
                      onChange={(e) => handleCheckBox(e, "sexe")}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 ring-0 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="female"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <button
            className="w-full rounded-md bg-violet-600 px-3 py-1 text-lg font-semibold text-white"
            onClick={creatTheFilterForPrisma}
          >
            Apply Filtes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
