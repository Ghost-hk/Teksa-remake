import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const postsRouter = router({
  getpostsByUserId: publicProcedure
    .input(
      z.object({
        numberOfPosts: z.number().default(8),
        userId: z.number(),
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
        ItemId: z.number(),
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
});
