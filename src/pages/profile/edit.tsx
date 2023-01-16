import { useEffect } from "react";
import type { z } from "zod";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

import Head from "next/head";
// import Image from "next/image";
import { useRouter } from "next/router";

import toast from "react-hot-toast";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForProfile } from "../../Components/Form/Input";
import { formSchemaForProfile } from "../../utils/TypeSchemas";

const EditProfilePage = () => {
  type FormType = z.infer<typeof formSchemaForProfile>;

  const router = useRouter();
  const { data: session, status } = useSession();

  const { mutateAsync: updateProfileTRPC } =
    trpc.profile.updateProfile.useMutation();

  const { data: profileData, isLoading } =
    trpc.profile.getProfileDataByUserEmail.useQuery(
      { userEmail: session?.user?.email as string },
      { enabled: !!session?.user?.email, refetchOnWindowFocus: false }
    );

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(formSchemaForProfile),
  });

  useEffect(() => {
    if (profileData) {
      profileData.image
        ? setValue("image", profileData?.image as string)
        : setValue("image", "");
      setValue("name", profileData?.name as string);
      setValue("email", profileData?.email as string);
      profileData.location
        ? setValue("location", profileData?.location as string)
        : setValue("location", "");
      profileData?.phone
        ? setValue("phone", profileData?.phone)
        : setValue("phone", "");
      profileData.whatsapp
        ? setValue("whatsapp", Number(profileData?.whatsapp) as number)
        : setValue("whatsapp", NaN);
      profileData.instagram
        ? setValue("instagram", profileData?.instagram as string)
        : setValue("instagram", "");
      setValue("showPhone", profileData?.showPhone as boolean);
      setValue("showWhatsapp", profileData?.showWhatsapp as boolean);
      setValue("useSameNumber", profileData?.useSameNumber as boolean);
      setValue("showInstagram", profileData?.showInstagram as boolean);
      setValue("showEmail", profileData?.showEmail as boolean);
    }
  }, [profileData, setValue]);

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    toast.error("You must be signed in to view this page", {
      duration: 6000,
    });
    router.push("/signin");
  }

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    console.log(data);
    toast
      .promise(updateProfileTRPC(data), {
        loading: "Updating...",
        success: "Profile Updated Successfully",
        error: "Something Went Wrong",
      })
      .then(() => {
        router.push("/profile");
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <div className="mx-3 mt-8 mb-5 flex justify-center md:mx-0 ">
      <Head>
        <title>Edit Profile</title>
      </Head>
      <div className="w-full bg-white px-3 py-5 shadow-md md:max-w-xl ">
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Edit Profile
        </h2>
        <form className="mt-3 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-2 font-semibold text-gray-800">
            Generale Information :
          </h4>

          {/* Add later Image seaction */}
          {/* <div className="mb-4 flex w-full items-center justify-center">
            {profileData?.image ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={profileData?.image as string}
                  fill
                  alt="profile image"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-400">
                <span className="text-lg font-semibold text-white">
                  {profileData?.name?.slice(0, 1)}
                </span>
              </div>
            )}
            <button>Edit</button>
            {profileData?.image || <button>Remove</button>}
          </div> */}

          <InputForProfile
            name="name"
            id="name"
            label="User Name"
            addtionnalClass="mb-4"
            register={register}
            errors={errors.name}
          />

          <InputForProfile
            name="email"
            id="email"
            label="Email"
            addtionnalClass="mb-4"
            register={register}
            errors={errors.email}
          />

          <InputForProfile
            name="location"
            id="location"
            label="Location"
            addtionnalClass="mb-4"
            register={register}
            errors={errors.location}
          />

          <select
            className={`mb-4 block w-full rounded-md border border-gray-600 p-2.5 text-gray-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 
            ${
              //   formErrors?.state &&
              //   formErrors?.sexe &&
              //   "!border-2 border-red-500"
              ""
            }
            `}
            {...register("sexe")}
          >
            <option value="">Choose a Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <InputForProfile
            name="size"
            id="size"
            label="Size"
            addtionnalClass="mb-4"
            register={register}
            errors={errors.size}
          />

          <h4 className="mb-2 font-semibold text-gray-800">
            Contact Information :
          </h4>

          <InputForProfile
            name="phone"
            id="phone"
            label="Phone"
            // type="number"
            addtionnalClass="mb-4"
            register={register}
            errors={errors.phone}
          />

          <InputForProfile
            name="whatsapp"
            id="whatsapp"
            label="Whatsapp Number"
            type="number"
            addtionnalClass={`mb-4 ${
              watch("useSameNumber") === true && "hidden"
            }`}
            register={register}
            errors={errors.whatsapp}
          />

          <InputForProfile
            name="instagram"
            id="instagram"
            label="Instagram Username"
            addtionnalClass="mb-4"
            register={register}
            errors={errors.instagram}
          />

          <h4 className="mb-2 font-semibold text-gray-800">
            Additional options :
          </h4>

          <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("showEmail")}
            />
            <div className="peer mb-2 h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white   "></div>
            <span className="ml-4 text-base font-medium text-gray-800 ">
              Show my Email
            </span>
          </label>

          <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("showPhone")}
            />
            <div className="peer mb-2 h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white   "></div>
            <span className="ml-4 text-base font-medium text-gray-800 ">
              Show my phone number
            </span>
          </label>

          <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("showWhatsapp")}
            />
            <div className="peer mb-2 h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white   "></div>
            <span className="ml-4 text-base font-medium text-gray-800 ">
              Show my WhatsApp
            </span>
          </label>

          <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("showInstagram")}
            />
            <div className="peer mb-2 h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white   "></div>
            <span className="ml-4 text-base font-medium text-gray-800 ">
              Show my Instagram
            </span>
          </label>

          <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("useSameNumber")}
            />
            <div className="peer mb-2 h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white   "></div>
            <span className="ml-4 text-base font-medium text-gray-800 ">
              Use the same number for WhatsApp
            </span>
          </label>

          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="py-1/2 rounded-md border-2 border-violet-600 px-3 text-lg font-semibold  text-violet-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
