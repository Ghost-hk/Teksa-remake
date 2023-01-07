import { z } from "zod";
import { type FormEvent, useState, type ChangeEvent } from "react";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";

import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import { Input, InputWithChoice } from "../../Components/Form/Input";

import { GrAdd } from "react-icons/gr";
import { FiInfo } from "react-icons/fi";

import { formSchema, type formErrorsSchema } from "../../utils/TypeSchemas";

const AddItem = () => {
  type FormType = z.infer<typeof formSchema>;

  type FormErrorsType = z.infer<typeof formErrorsSchema>;

  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrorsType | null>(null);
  const [isFormValidating, setIsFormValidating] = useState<boolean>(false);

  const { data: seassion, status } = useSession();
  const router = useRouter();

  const { mutateAsync } = trpc.test.upload.useMutation();
  const { mutateAsync: addItem } = trpc.posts.createPost.useMutation();

  const categories = trpc.posts.getAllCategories.useQuery();
  const brands = trpc.posts.getAllBrands.useQuery();

  const { register, setValue, getValues, watch } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  if (status === "unauthenticated") {
    return router.push("/signin");
  }

  const handelImgSelection = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = Array.from(e.target.files as FileList);
    setImages((prev) => [...prev, ...files]);

    files.forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(image as File);
    });
  };

  const handleDeleteImage = (img: string, index: number) => {
    setImagesPreview(imagesPreview.filter((curr) => curr !== img));
    setImages((prev) => prev.filter((curr) => curr !== prev[index]));
  };

  const uploadToS3 = async () => {
    return new Promise(async (resolve, reject) => {
      setValue("images", null);

      const files = images;
      if (files.length === 0) {
        setIsFormValidating(false);
        setFormErrors({
          state: true,
          images: ["Please select at least one image"],
        });
        // toast.dismiss();
      } else if (files.length > 5) {
        setIsFormValidating(false);
        setFormErrors({
          state: true,
          images: ["Only 5 images are allowed"],
        });
        // toast.dismiss();
      }
      files.map(async (file, ind) => {
        if (file instanceof File) {
          const fileType = encodeURIComponent(file.type);

          const res = await mutateAsync({ fileType });
          if (res) {
            const { s3UploadUrl, Key } = res;
            setValue(`images.${ind}`, Key);
            await fetch(s3UploadUrl, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": `image/${fileType}`,
              },
            });
            resolve(Key);
          } else {
            setIsFormValidating(false);
            reject("error, no data");
          }
        }
      });
    });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormValidating(true);

    //Check for user
    if (status === "authenticated" && seassion) {
      seassion.user && setValue("userEmail", seassion.user.email as string);

      try {
        formSchema.parse(getValues());
      } catch (err) {
        if (err instanceof z.ZodError) {
          const { fieldErrors } = err.flatten();
          setFormErrors({
            state: false,
            ...fieldErrors,
          });
          setIsFormValidating(false);
          if (
            fieldErrors.title ||
            fieldErrors.sexe ||
            fieldErrors.size ||
            fieldErrors.price ||
            fieldErrors.brand ||
            fieldErrors.category
          ) {
            setFormErrors({
              state: true,
              ...fieldErrors,
            });
            // toast.dismiss(loadingToast);
            return setIsFormValidating(false);
          }
        } else {
          setIsFormValidating(false);
          throw new Error("Something went wrong", err as ErrorOptions);
        }
      }
      let toastLoading = "";
      uploadToS3()
        .then(async () => {
          toastLoading = toast.loading("Creating post...");
          const data = getValues();
          await addItem(data);
          setIsFormValidating(false);
          toast.success("Post created successfully", {
            id: toastLoading,
          });
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
          setIsFormValidating(false);
          toast.error("Something went wrong, try again", {
            id: toastLoading,
          });
        });
    }
  };

  return (
    <div className="mx-3 mt-8 mb-5 flex justify-center md:mx-0 ">
      <Head>
        <title>Add Item</title>
      </Head>
      <div className="w-full bg-white px-3 py-5 shadow-md md:max-w-xl ">
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Add New Item
        </h2>

        <form className="mt-3 flex flex-col" onSubmit={submit}>
          {formErrors?.state && (
            <div className="mb-4 flex flex-col items-center justify-center rounded-md bg-red-300 py-2 px-4">
              <p className="text-red-600">Please fill in all required fields</p>
            </div>
          )}

          <Input
            name="title"
            id="title"
            label="Title"
            addtionnalClass="mb-4"
            register={register}
            formErrors={formErrors}
          />

          <Input
            name="description"
            id="description"
            label="Description"
            addtionnalClass="mb-4"
            register={register}
            formErrors={formErrors}
          />

          <Input
            name="price"
            id="price"
            label="Price"
            addtionnalClass="mb-4"
            type="number"
            register={register}
            formErrors={formErrors}
          />

          <Input
            name="size"
            id="size"
            label="Size"
            addtionnalClass="mb-4"
            register={register}
            formErrors={formErrors}
          />

          <InputWithChoice
            name="category"
            id="category"
            label="Category"
            addtionnalClass="mb-4"
            data={categories.data}
            register={register}
            watch={watch}
            setValue={setValue}
            formErrors={formErrors}
          />

          <InputWithChoice
            name="brand"
            id="brand"
            label="Brand"
            addtionnalClass="mb-4"
            data={brands.data}
            register={register}
            watch={watch}
            setValue={setValue}
            formErrors={formErrors}
          />

          <select
            className={`mb-4 block w-full rounded-md border border-gray-600 p-2.5 text-gray-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 ${
              formErrors?.state &&
              formErrors?.sexe &&
              "!border-2 border-red-500"
            }`}
            {...register("sexe")}
          >
            <option defaultValue="">Choose a Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Image Input */}
          <input
            id="imageInput"
            name="imageInput"
            type="file"
            accept="image/png image/jepg"
            className="hidden"
            onChange={handelImgSelection}
            multiple
          />
          {/* Images previes + Image input label (ui btn) */}
          <div className="mb-2">
            <p
              className={`text-base text-gray-600 ${
                formErrors?.state && formErrors?.images && "!text-red-500"
              }`}
            >
              Add Images
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2">
            {imagesPreview.map((img, ind) => (
              <div
                key={ind}
                className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border-2 border-gray-600"
                onClick={() => handleDeleteImage(img, ind)}
              >
                <Image src={img as string} fill alt="image preview" />
              </div>
            ))}

            <label
              htmlFor="imageInput"
              className={`flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-gray-600 ${
                formErrors?.state &&
                formErrors?.images &&
                "!border-2 border-red-500"
              }`}
            >
              <GrAdd
                className={`text-gray-600 ${
                  formErrors?.state && formErrors?.images && "!text-red-500"
                }`}
              />
            </label>
          </div>
          {formErrors?.state && formErrors?.images && (
            <p className="text-red-500">{formErrors?.images[0]}</p>
          )}
          {imagesPreview.length > 0 ? (
            <p className="mb-4 mt-1 flex items-center text-center text-xs text-gray-400">
              <span>
                <FiInfo className="mr-1 text-base" />
              </span>
              Click on an image to remove it from selection
            </p>
          ) : (
            <div className="mb-4"></div>
          )}

          <button
            type="submit"
            className={`rounded-md border-2 border-violet-600 px-3 py-1 ${
              isFormValidating && "cursor-not-allowed opacity-50"
            }`}
            disabled={isFormValidating}
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
