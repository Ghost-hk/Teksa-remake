import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: "v4",
});

export const testRout = router({
  upload: publicProcedure
    .input(
      z.object({
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const extension = input.fileType;
      const Key = `${randomUUID()}.${extension}`;

      const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key,
        Expires: 60,
        ContentType: `image/${extension}`,
      };

      const s3UploadUrl = await s3.getSignedUrl("putObject", s3Params);

      return {
        s3UploadUrl,
        Key,
      };
    }),
});
