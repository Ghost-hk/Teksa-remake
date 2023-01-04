import type { Brand, Category } from "@prisma/client";
import type { FC } from "react";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";

interface UseFormWatchInterface {
  description?: string | undefined;
  images: [string, ...string[]];
  brand: string;
  category: string;
  size: string;
  sexe: "Male" | "Female";
  title: string;
  price: number;
  userEmail: string;
}

interface InputProps {
  name: "title" | "description" | "price" | "size";
  id: string;
  type?: string;
  label: string;
  addtionnalClass?: string;
  register: UseFormRegister<UseFormWatchInterface>;
}

export const Input: FC<InputProps> = ({
  name,
  type,
  id,
  label,
  addtionnalClass,
  register,
}) => {
  return (
    <div className="relative w-full">
      <input
        // name={name}
        type={type ? type : "text"}
        id={id}
        className={`border-1 peer w-full rounded-lg border-gray-600 text-gray-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 ${addtionnalClass}`}
        placeholder="  "
        // onChange={changeHandler}
        {...(type === "number"
          ? { ...register(name, { valueAsNumber: true }) }
          : { ...register(name) })}
        // {...register(name)}
      />
      <label
        htmlFor="email"
        className={`pointer-events-none absolute -top-2.5 left-1.5 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:border-violet-600 peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 `}
      >
        {label}
      </label>
    </div>
  );
};

interface InputWithChoiceProps {
  data: Brand[] | Category[] | undefined | null;
  name: "category" | "brand";
  id: string;
  label: string;
  addtionnalClass?: string;
  register: UseFormRegister<UseFormWatchInterface>;
  watch: UseFormWatch<UseFormWatchInterface>;
  setValue: UseFormSetValue<UseFormWatchInterface>;
}

export const InputWithChoice: FC<InputWithChoiceProps> = ({
  data,
  name,
  id,
  label,
  addtionnalClass,
  register,
  watch,
  setValue,
}) => {
  return (
    <div className="relative">
      <div className="relative w-full">
        <input
          // name={name}
          type="text"
          id={id}
          autoComplete="off"
          className={`border-1 peer w-full rounded-lg border-gray-600 text-gray-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 ${addtionnalClass}`}
          placeholder="  "
          {...register(name)}
        />
        <label
          htmlFor="email"
          className={`pointer-events-none absolute -top-2.5 left-1.5 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:border-violet-600 peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 `}
        >
          {label}
        </label>
      </div>
      {data && (
        <div className="absolute top-10 w-full rounded-md bg-slate-300 shadow-lg">
          {data
            .filter((item: Category) => {
              const searchTerm = watch(name).toLowerCase();
              const fullName = item.name.toLowerCase();
              return (
                searchTerm &&
                fullName.startsWith(searchTerm) &&
                fullName !== searchTerm
              );
            })
            .map((item: Category) => (
              <div
                onClick={() => setValue(name, item.name)}
                key={item.name}
                className="my-2 mx-3 cursor-pointer capitalize text-gray-800"
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
