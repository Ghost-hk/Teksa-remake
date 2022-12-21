import { Dispatch, FC, SetStateAction } from "react";

interface InputProps {
  name: string;
  type: string;
  label: string;
  additionalClasses?: string;
}

const Input: FC<InputProps> = ({ name, type, label, additionalClasses }) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={name}
        className={`border-1 peer w-full rounded-lg border-gray-600 text-gray-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 ${additionalClasses}`}
        placeholder="  "
        // value={formValues[name]}
      />
      <label
        htmlFor={name}
        className={`absolute -top-2.5 left-1.5
        bg-white px-2 text-sm text-gray-500
          duration-300 
          peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base
          peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:border-violet-600 peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 ${additionalClasses}`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
