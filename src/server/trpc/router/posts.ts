import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import { formSchema } from "../../../utils/TypeSchemas";

import S3 from "aws-sdk/clients/s3";

export const postsRouter = router({
  getpostsByUserId: publicProcedure
    .input(
      z.object({
        numberOfPosts: z.number().default(8),
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { numberOfPosts, userId } = input;

      const posts = await ctx.prisma.post.findMany({
        where: { userId },
        include: {
          images: true,
          brand: true,
          user: true,
        },
        take: numberOfPosts,
      });

      return posts;
    }),

  getpostByItemId: publicProcedure
    .input(
      z.object({
        ItemId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { ItemId } = input;

      const posts = await ctx.prisma.post.findUniqueOrThrow({
        where: { id: ItemId },
        include: {
          images: true,
          brand: true,
          user: {
            include: {
              posts: true,
            },
          },
          category: true,
        },
      });

      return posts;
    }),

  getAllPosts: publicProcedure
    .input(
      z.object({
        numberOfPosts: z.number().default(8),
      })
    )
    .query(async ({ input, ctx }) => {
      const { numberOfPosts } = input;

      const posts = await ctx.prisma.post.findMany({
        where: {},
        include: {
          images: true,
          brand: true,
          user: true,
        },
        take: numberOfPosts,
      });

      return posts;
    }),

  createPost: protectedProcedure
    .input(formSchema)
    .mutation(async ({ ctx, input }) => {
      const { userEmail } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        throw new Error("User not found");
      }

      try {
        const post = await ctx.prisma.post.create({
          data: {
            title: input.title,
            description: input.description,
            price: input.price,
            size: input.size,
            sexe: input.sexe,
            brand: {
              connectOrCreate: {
                where: { name: input.brand },
                create: { name: input.brand },
              },
            },
            category: {
              connectOrCreate: {
                where: { name: input.category },
                create: { name: input.category },
              },
            },
            userId: user.id,
          },
        });

        input.images &&
          input.images.map(async (image) => {
            return await ctx.prisma.images.create({
              data: {
                imageUrl: `https://teksa-images.s3.eu-west-2.amazonaws.com/${image}`,
                postId: post.id,
              },
            });
          });

        return post;
      } catch (e) {
        console.log("Post or Image couldnt be created ", e);
      }
    }),

  getAllCategories: publicProcedure
    .input(z.object({ inp: z.string() }))
    .query(async ({ ctx }) => {
      const categories = await ctx.prisma.category.findMany({});
      return categories;
    }),

  getAllBrands: publicProcedure
    .input(z.object({ inp: z.string() }))
    .query(async ({ ctx }) => {
      const brands = await ctx.prisma.brand.findMany({});
      return brands;
    }),

  deleteImage: protectedProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const s3 = new S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: process.env.REGION,
        signatureVersion: "v4",
      });
      console.log("hit the delete image route");
      s3.deleteObject(
        {
          Bucket: process.env.BUCKET_NAME as string,
          Key: input.imageUrl.slice(48),
        },
        (err, data) => {
          console.error(err);
          console.log(data);
        }
      );

      const image = await ctx.prisma.images.delete({
        where: { imageUrl: input.imageUrl },
      });

      return image;
    }),

  updatePost: protectedProcedure
    .input(formSchema)
    .mutation(async ({ ctx, input }) => {
      const { userEmail } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          posts: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.posts.some((post) => post.id === input.id)) {
        throw new Error("You are not authorized to update this post");
      }

      try {
        const post = await ctx.prisma.post.update({
          where: { id: input.id },
          data: {
            title: input.title,
            description: input.description,
            price: input.price,
            size: input.size,
            sexe: input.sexe,
            brand: {
              connectOrCreate: {
                where: { name: input.brand },
                create: { name: input.brand },
              },
            },
            category: {
              connectOrCreate: {
                where: { name: input.category },
                create: { name: input.category },
              },
            },
            userId: user.id,
          },
        });

        input.images &&
          input.images.map(async (image) => {
            return await ctx.prisma.images.create({
              data: {
                imageUrl: `https://teksa-images.s3.eu-west-2.amazonaws.com/${image}`,
                postId: post.id,
              },
            });
          });

        return post;
      } catch (e) {
        console.log("Post or Image couldnt be created ", e);
      }
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;

      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
        include: {
          images: true,
        },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const s3 = new S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: process.env.REGION,
        signatureVersion: "v4",
      });

      post.images.map((image) => {
        s3.deleteObject(
          {
            Bucket: process.env.BUCKET_NAME as string,
            Key: image.imageUrl.slice(48),
          },
          (err, data) => {
            console.error(err);
            console.log(data);
          }
        );
      });

      const deletedPost = await ctx.prisma.post.delete({
        where: { id: postId },
      });

      return deletedPost;
    }),

  paginatedPosts: publicProcedure
    .input(
      z.object({
        filters: z
          .object({
            brand: z.string().array().optional(),
            sexe: z.string().array().optional(),
            category: z.string().array().optional(),
            size: z.string().array().optional(),
            price: z.number().optional().optional(),
          })
          .optional(),
        currPage: z.number().int().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filters, currPage } = input;
      console.log(filters);
      const take = 10;
      const posts = await ctx.prisma.post.findMany({
        skip: take * currPage - take,
        take: take,
        where: {
          OR: [
            {
              category: {
                some: { name: { in: filters?.category } },
              },
            },
            {
              brand: {
                some: { name: { in: filters?.brand } },
              },
            },
            {
              sexe: {
                in: filters?.sexe,
              },
            },
            {
              size: {
                in: filters?.size,
              },
            },
            // {
            //   price: { lte: filters?.price },
            // },
          ],
          AND: [
            {
              price: { lte: filters?.price },
            },
          ],
        },
        include: {
          images: true,
          brand: true,
          user: true,
        },
      });

      // add the filters obj !!!!!
      const numOfPosts = await ctx.prisma.post.count({});

      const numberOfPages = Math.ceil(numOfPosts / take);

      return {
        numberOfPages,
        posts,
      };
    }),
});
