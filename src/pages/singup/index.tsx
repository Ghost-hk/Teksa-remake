import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  username: z.string().min(6).max(16),
  email: z.string().email(),
  password: z.string().min(8).max(32),
  confirmpassword: z.string().min(8).max(32),
});

type FormType = z.infer<typeof formSchema>;

const SingUp = () => {
  const { mutate, isError, error } = trpc.singup.singUp.useMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    if (data.password !== data.confirmpassword) {
      return setError("confirmpassword", {
        type: "custom",
        message: "The passwords did not match",
      });
    }

    mutate(data);

    if (isError) {
      return;
    }
  };

  useEffect(() => {
    if (error?.message === "Username already taken") {
      return setError("username", {
        type: "custom",
        message: "Username already taken",
      });
    } else if (error?.message === "Email already taken") {
      return setError("email", {
        type: "custom",
        message: "Email already taken",
      });
    } else if (
      error?.message === "User with this Email and Username already Exists"
    ) {
      setError("username", {
        type: "custom",
        message: "Username already taken",
      });
      setError("email", {
        type: "custom",
        message: "Email already taken",
      });
    }
  }, [error, setError]);

  return (
    <>
      <Head>
        <title>Sing Up</title>
      </Head>
      <div className="w-full px-4">
        <div className="mx-auto  my-8 flex flex-col items-center justify-center rounded-md bg-white px-3 shadow-md md:max-w-xl">
          <h1 className="my-4 text-2xl font-semibold text-gray-800">Sing Up</h1>
          <form className="my-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            {isError && (
              <div className="mb-2 rounded-md bg-red-500">
                <p className="py-2 text-center text-base text-white ">
                  {error.message}
                </p>
              </div>
            )}
            {/* Inputs */}

            <div className="relative w-full">
              <input
                type="text"
                id="username"
                className={`border-1 peer mt-4 w-full rounded-lg border-gray-600 text-gray-800  focus:outline-none focus:ring-1 ${
                  errors.username
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-violet-600 focus:ring-violet-600"
                }`}
                placeholder="  "
                {...register("username")}
              />
              <label
                htmlFor="username"
                className={`absolute -top-2.5 left-1.5
                    mt-4 bg-white px-2 text-sm
                    text-gray-500 
                    duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2
                    peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5  peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 ${
                      errors.username
                        ? "peer-focus:text-red-500"
                        : "peer-focus:text-violet-600"
                    }`}
              >
                Username
              </label>
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="text"
                id="email"
                className={`border-1 peer mt-4 w-full rounded-lg border-gray-600 text-gray-800  focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-violet-600 focus:ring-violet-600"
                }`}
                placeholder="  "
                {...register("email")}
              />
              <label
                htmlFor="email"
                className={`absolute -top-2.5 left-1.5
                    mt-4 bg-white px-2 text-sm
                    text-gray-500 
                    duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2
                    peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5  peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 ${
                      errors.email
                        ? "peer-focus:text-red-500"
                        : "peer-focus:text-violet-600"
                    }`}
              >
                Email
              </label>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="password"
                id="password"
                className={`border-1 peer mt-4 w-full rounded-lg border-gray-600 text-gray-800  focus:outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-violet-600 focus:ring-violet-600"
                }`}
                placeholder="  "
                {...register("password")}
              />
              <label
                htmlFor="password"
                className={`absolute -top-2.5 left-1.5
                    mt-4 bg-white px-2 text-sm
                    text-gray-500 
                    duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2
                    peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5  peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 ${
                      errors.password
                        ? "peer-focus:text-red-500"
                        : "peer-focus:text-violet-600"
                    }`}
              >
                Password
              </label>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="password"
                id="confirmpassword"
                className={`border-1 peer mt-4 w-full rounded-lg border-gray-600 text-gray-800  focus:outline-none focus:ring-1 ${
                  errors.confirmpassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-violet-600 focus:ring-violet-600"
                }`}
                placeholder="  "
                {...register("confirmpassword")}
              />
              <label
                htmlFor="confirmpassword"
                className={`absolute -top-2.5 left-1.5
                    mt-4 bg-white px-2 text-sm
                    text-gray-500 
                    duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:left-2
                    peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-1.5  peer-focus:px-2 peer-focus:text-sm peer-focus:text-violet-600 ${
                      errors.confirmpassword
                        ? "peer-focus:text-red-500"
                        : "peer-focus:text-violet-600"
                    }`}
              >
                Confirm password
              </label>
              {errors.confirmpassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmpassword.message}
                </p>
              )}
            </div>
            {/* end of Inputs */}

            {/* Submit Btn */}
            <div className="mt-4 flex w-full justify-end">
              <button
                type="submit"
                className="rounded-md bg-violet-600 px-6 py-2 text-base text-white shadow shadow-violet-600"
                disabled={isSubmitting}
              >
                Sing Up
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
              onClick={() => signIn("google", { callbackUrl: "/" })}
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
              Sing Up with Google
            </button>

            {/* Already have an acount? */}
            <div className="mt-6">
              <p className="text-center text-gray-800">
                Already have an acount?{" "}
                <Link href="/login" className="text-violet-600 underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SingUp;
