import { FormEvent } from "react";

//import tRPC
import { trpc } from "../utils/trpc";

export default function App() {
  const { mutateAsync } = trpc.test.upload.useMutation();

  const uploadToS3 = async (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    if (!file) return;

    // @ts-ignore
    const fileType = encodeURIComponent(file.type);
    console.log(fileType);
    const res = await mutateAsync({ fileType });
    console.log(res);
    if (res) {
      const { s3UploadUrl, Key } = res;
      await fetch(s3UploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": `image/${fileType}`,
        },
      });
      console.log("success");
      return Key;
    } else {
      console.log("error, no data");
    }
  };
  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    uploadToS3(e);
  };

  return (
    <div className="App">
      <form onSubmit={handelSubmit}>
        <input type="file" accept="image/jpeg image/png" name="file" />
        <button type="submit">upload</button>
      </form>
      <img
        src="https://teksa-images.s3.eu-west-2.amazonaws.com/balckHoodie.jpeg"
        alt=""
      />
    </div>
  );
}
