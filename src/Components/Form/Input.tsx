import type { Brand, Category } from "@prisma/client";
import type { FC } from "react";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";
import type { z } from "zod";

import type { formErrorsSchema } from "../../utils/TypeSchemas";

type FormErrorsType = z.infer<typeof formErrorsSchema>;

interface UseFormWatchInterface {
  description?: string | undefined | null;
  images: [string, ...string[]] | null;
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
  // name: string;
  id: string;
  type?: string;
  label: string;
  addtionnalClass?: string;
  register: UseFormRegister<UseFormWatchInterface>;
  formErrors: FormErrorsType | null;
}

export const Input: FC<InputProps> = ({
  name,
  type,
  id,
  label,
  addtionnalClass,
  register,
  formErrors,
}) => {
  return (
    <div className={`relative w-full ${addtionnalClass}`}>
      <input
        type={type ? type : "text"}
        id={id}
        className={`border-1 peer w-full rounded-lg border-gray-600 text-gray-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 ${
          formErrors &&
          name in formErrors &&
          "border-2 border-red-500  focus:border-red-500 focus:ring-red-500"
        }`}
        autoFocus={formErrors && name in formErrors ? true : false}
        placeholder=" "
        {...(type === "number"
          ? { ...register(name, { valueAsNumber: true }) }
          : { ...register(name) })}
      />

      <label
        htmlFor="email"
        className={`pointer-events-none absolute -top-2.5 left-1.5 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:border-violet-600 peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 ${
          formErrors &&
          name in formErrors &&
          "text-red-500 peer-focus:text-red-500"
        }`}
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
  formErrors: object | undefined | null;
}

export const InputWithChoice: FC<InputWithChoiceProps> = ({
  data, // category and brand choises
  name,
  id,
  label,
  addtionnalClass,
  register,
  watch,
  setValue,
  formErrors,
}) => {
  return (
    <div className={`relative w-full ${addtionnalClass}`}>
      <div className="relative w-full">
        <input
          // name={name}
          type="text"
          id={id}
          autoComplete="off"
          className={`border-1 peer w-full rounded-lg border-gray-600 text-gray-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 ${
            formErrors &&
            name in formErrors &&
            "border-2 border-red-500  focus:border-red-500 focus:ring-red-500"
          }`}
          placeholder="  "
          {...register(name)}
        />
        <label
          htmlFor="email"
          className={`pointer-events-none absolute -top-2.5 left-1.5 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:border-violet-600 peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600  ${
            formErrors &&
            name in formErrors &&
            "text-red-500 peer-focus:text-red-500"
          }`}
        >
          {label}
        </label>
      </div>
      {data && (
        <div className="absolute top-10 z-20 w-full rounded-md bg-slate-300 shadow-lg">
          {data &&
            data
              .filter((item: Category) => {
                const searchTerm = watch(name)?.toLowerCase();
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
