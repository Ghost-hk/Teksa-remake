// import { FC } from "react";
import Head from "next/head";
import Link from "next/link";
import Input from "../../Components/comps/Input";
import { signIn, signOut, useSession } from "next-auth/react";

// interface loginProps {}

const Login = () => {
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const googleHandler = () => {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  };

  const instagramHandler = () => {
    signIn("instagram", { callbackUrl: "https://localhost:3000" });
  };

  return (
    <div className="w-full px-4">
      <Head>
        <title>Login</title>
      </Head>

      <div className="mx-auto  my-8 flex flex-col items-center justify-center rounded-md bg-white px-3 shadow-md md:max-w-xl">
        <h1 className="my-4 text-2xl font-semibold text-gray-800">Login</h1>
        <form onSubmit={submitHandler} className="my-4 w-full ">
          <Input name="email" type="email" label="Email" additionalClasses="" />
          <Input
            name="password"
            type="password"
            label="Password"
            additionalClasses="mt-4"
          />
          <div className="mt-4 flex w-full justify-end">
            <button
              type="submit"
              className="rounded-md bg-violet-600 px-6 py-2 text-base text-white shadow shadow-violet-600"
            >
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 flex-shrink text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          {/* Google Btn */}
          <button
            onClick={googleHandler}
            className="mb-4 flex w-full justify-center rounded-md border py-2 text-lg font-medium text-gray-600 shadow-md shadow-gray-400"
          >
            <span className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={24}
                height={24}
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use href="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path
                  clipPath="url(#b)"
                  fill="#EA4335"
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                />
                <path
                  clipPath="url(#b)"
                  fill="#34A853"
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                />
                <path
                  clipPath="url(#b)"
                  fill="#4285F4"
                  d="M48 48L17 24l-4-3 35-10z"
                />
              </svg>
            </span>
            Login with Google
          </button>

          {/* Instagram Btn */}
          <button
            onClick={instagramHandler}
            className="instagram  flex w-full items-center justify-center  rounded-md bg-violet-600 px-6 py-2 text-lg font-medium  text-white shadow-md shadow-gray-400"
          >
            Login with Instagram
          </button>
          <div className="mt-6">
            <p className="text-center text-gray-800">
              Don&apos;t have an acount?{" "}
              <Link href="/singup" className="text-violet-600 underline">
                Sing up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
