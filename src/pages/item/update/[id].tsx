import { z } from "zod";
import { trpc } from "../../../utils/trpc";
import { type ChangeEvent, useState, useEffect, type FormEvent } from "react";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import { formSchema, type formErrorsSchema } from "../../../utils/TypeSchemas";

import { GrAdd } from "react-icons/gr";
import { FiInfo } from "react-icons/fi";

import { Input, InputWithChoice } from "../../../Components/Form/Input";
import toast from "react-hot-toast";

const UpdateItemPage = () => {
  type FormType = z.infer<typeof formSchema>;
  type FormErrorsType = z.infer<typeof formErrorsSchema>;

  const router = useRouter();
  const { id } = router.query;
  const { data: seassion, status } = useSession();

  const [formErrors, setFormErrors] = useState<FormErrorsType | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [isFormValidating, setIsFormValidating] = useState<boolean>(false);
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);

  const categories = trpc.posts.getAllCategories.useQuery();
  const brands = trpc.posts.getAllBrands.useQuery();
  const { mutateAsync: deleteImageTRPC } = trpc.posts.deleteImage.useMutation();
  const { mutateAsync: uploadToS3TRPC } = trpc.test.upload.useMutation();
  const { mutateAsync: updatePostTRPC } = trpc.posts.updatePost.useMutation();

  const { register, setValue, getValues, watch } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const { data: prevData, isLoading } = trpc.posts.getpostByItemId.useQuery(
    { ItemId: id as string },
    { enabled: !!id, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (prevData) {
      setImagesUrl([]);
      setValue("title", prevData.title);
      setValue("description", prevData.description);
      setValue("price", prevData.price);
      setValue("size", prevData.size);
      setValue("sexe", prevData.sexe as "Male" | "Female");
      setValue("category", prevData.category[0]?.name as string);
      setValue("brand", prevData.brand[0]?.name as string);
      prevData.images.map((img, ind) => {
        setValue(`images.${ind}`, img.imageUrl as string);
        setImagesUrl((prev) => [...prev, img.imageUrl as string]);
      });
    }
  }, [prevData, setValue]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handelImgSelection = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = Array.from(e.target.files as FileList);
    setImagesFile((prev) => [...prev, ...files]);

    files.forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(image as File);
    });
  };

  const handleDeleteImagePreview = (img: string, index: number) => {
    setImagesPreview(imagesPreview.filter((curr) => curr !== img));
    setImagesFile((prev) => prev.filter((curr) => curr !== prev[index]));
  };

  const handleDeleteImageUpdated = (img: string) => {
    if (imagesUrl.length === 1 && imagesFile.length === 0) {
      setFormErrors({
        state: true,
        images: ["You must have at least one image"],
      });
      return;
    }
    deleteImageTRPC({ imageUrl: img });
    imagesUrl.map((curr: string, ind: number) => {
      if (curr == img) {
        setValue(`images.${ind}`, "");
        const idxToDelete = imagesUrl.indexOf(img);
        setImagesUrl((prev) => prev.splice(idxToDelete, 1));
      }
    });
  };

  const uploadToS3 = async () => {
    return new Promise(async (resolve, reject) => {
      setValue("images", null);

      const files = imagesFile;
      if (files.length === 0 && imagesUrl.length === 0) {
        setIsFormValidating(false);
        setFormErrors({
          state: true,
          images: ["Please select at least one image"],
        });
        reject("Please select at least one image");
        return;
        // toast.dismiss();
      }
      if (files.length > 5 || files.length + imagesUrl.length > 5) {
        setIsFormValidating(false);
        setFormErrors({
          state: true,
          images: ["Only 5 images are allowed"],
        });
        reject("Only 5 images are allowed");
        return;
        // toast.dismiss();
      }
      files.map(async (file, ind) => {
        if (file instanceof File) {
          const fileType = encodeURIComponent(file.type);

          const res = await uploadToS3TRPC({ fileType });
          if (res) {
            const { s3UploadUrl, Key } = res;
            setValue(`images.${ind}`, Key);
            // setImagesUrl((prev) => [...prev, Key]);
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

  console.log(watch());

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormValidating(true);

    //Check for user
    if (status === "authenticated" && seassion) {
      seassion.user && setValue("userEmail", seassion.user.email as string);
      setValue("id", id as string);

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
          toastLoading = toast.loading("Updating post...");
          await updatePostTRPC(getValues());
          setIsFormValidating(false);
          toast.success("Post updated successfully", {
            id: toastLoading,
          });
          router.push("/profile");
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
        <title>Update {prevData?.title}</title>
      </Head>
      {prevData && (
        <div className="w-full rounded-md bg-white px-3 py-5 shadow-md md:max-w-xl ">
          <form className="mt-3 flex flex-col" onSubmit={submit}>
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
                  onClick={() => handleDeleteImagePreview(img, ind)}
                >
                  <Image src={img as string} fill alt="image preview" />
                </div>
              ))}

              {imagesUrl.map((img, ind) => (
                <div
                  key={ind}
                  className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border-2 border-gray-600"
                  onClick={() => handleDeleteImageUpdated(img)}
                >
                  <Image src={img} fill alt="image preview" />
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
      )}
    </div>
  );
};

export default UpdateItemPage;
