import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import { formSchema } from "../../../utils/TypeSchemas";

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

      // const user = await ctx.prisma.user.findUniqueOrThrow({
      //   where: { id: posts.userId },
      //   include: {
      //     posts: true,
      //   },
      // });

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

      // const images = await ctx.prisma.images.create({
      //   data: input.images.map((image, ind) => ({
      //     name: input.images[ind],
      //     postId: post.id,
      //   })),
      // });
    }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({});
    return categories;
  }),

  getAllBrands: publicProcedure.query(async ({ ctx }) => {
    const brands = await ctx.prisma.brand.findMany({});
    return brands;
  }),
});
