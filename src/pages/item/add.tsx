import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

import { Input, InputWithChoice } from "../../Components/Form/Input";

import { formSchema } from "../../utils/TypeSchemas";

// export const formSchema = z.object({
//   title: z.string().min(8).max(100),
//   description: z.string().min(8).max(255).optional(),
//   price: z.number(),
//   sexe: z.enum(["Male", "Female"]),
//   size: z.string(),
//   images: z
//     .array(z.string())
//     .nonempty({
//       message: "Each item must have at least one image",
//     })
//     .max(5),
//   category: z.string(),
//   brand: z.string(),
//   userEmail: z.string(),
// });

const AddItem = () => {
  type FormType = z.infer<typeof formSchema>;

  const { data: seassion, status } = useSession();

  const { mutateAsync } = trpc.test.upload.useMutation();
  const { mutateAsync: addItem } = trpc.posts.createPost.useMutation();

  const categories = trpc.posts.getAllCategories.useQuery();
  const brands = trpc.posts.getAllBrands.useQuery();

  const { register, setValue, getValues, watch } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const uploadToS3 = async (e: FormEvent<HTMLFormElement>) => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData(e.currentTarget);
      const files = formData.getAll("file");

      if (!files) return;

      files.map(async (file, ind) => {
        //@ts-ignore
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
          reject("error, no data added to s3");
        }
      });
    });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit hit");

    //Check for user
    if (status === "unauthenticated") return;

    if (status === "authenticated" && seassion) {
      seassion.user && setValue("userEmail", seassion.user.email as string);

      try {
        const data = formSchema.parse(getValues());
        console.log(data);
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          console.log(err.flatten());
        } else {
          throw new Error("Something went wrong", err);
        }
      }

      //   uploadToS3(e)
      //     .then(async (key) => {
      //       const data = getValues();
      //       console.log(data);
      //       const res = await addItem(data);
      //       console.log("Post created successfully", res);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    }
  };

  return (
    <div className="mt-8 flex justify-center ">
      <div className="w-full bg-white px-3 py-5 shadow-md md:max-w-xl ">
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Add New Item
        </h2>

        <form className="mt-3 flex flex-col" onSubmit={submit}>
          <Input
            name="title"
            id="title"
            label="Title"
            addtionnalClass="mb-4"
            register={register}
          />

          <Input
            name="description"
            id="description"
            label="Description"
            addtionnalClass="mb-4"
            register={register}
          />

          <Input
            name="price"
            id="price"
            label="Price"
            addtionnalClass="mb-4"
            type="number"
            register={register}
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
          />

          <select
            id="countries"
            className="mb-2 block w-full rounded-md border border-gray-600 p-2.5 text-gray-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          >
            <option selected>Choose a Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button
            type="submit"
            className="rounded-md border-2 border-red-600 px-3 py-1"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
