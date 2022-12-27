import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const postsRouter = router({
  getposts: publicProcedure
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
          category: true,
          user: true,
        },
        take: numberOfPosts,
      });

      return posts;
    }),
});
