import { FC } from "react";

interface InputProps {
  name: string;
  type: string;
  label: string;
}

const Input: FC<InputProps> = ({ name, type, label }) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={name}
        className="border-1 peer block w-full  rounded-lg border-gray-800 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0   "
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-violet-600   "
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
