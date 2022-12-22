import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import bcrypt from "bcrypt";

export const singUpRouter = router({
  singUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(32),
        username: z.string().min(6).max(24),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const passwordHash = bcrypt.hashSync(input.password, 10);
      try {
        return await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: passwordHash,
            name: input.username,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
