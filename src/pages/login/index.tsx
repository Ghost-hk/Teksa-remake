import { FC } from "react";
import Input from "../../Components/Forms/Input";

interface loginProps {}

const login: FC<loginProps> = () => {
  return (
    <div className="mx-4 my-8 flex flex-col items-center justify-center bg-white px-3 shadow-md">
      <h1 className="wei text-2xl font-semibold text-gray-800">login</h1>
      <Input name="email" type="email" label="Email" />
    </div>
  );
};

export default login;
