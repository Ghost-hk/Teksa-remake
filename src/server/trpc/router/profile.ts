import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const profileRouter = router({
  getProfileDataByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true, // String
          name: true, // String
          email: true, // String
          posts: {
            include: {
              images: true,
              brand: true,
              category: true,
              user: true,
            },
          }, // Array of Posts
          phone: true, // String
          whatsapp: true, // String
          instagram: true, // String
          facebook: true, // String
          image: true, // String Url
          location: true, // String
          showPhone: true, // Boolian
          showWhatsapp: true, // Boolian
          useSameNumber: true, // Boolian
          showInstagam: true, // Boolian
          showFacebook: true, // Boolian
          showEmail: true, // Boolian
          createdAt: true, // String
          updatedAt: true, // String
        },
      });

      return user;
    }),
});
