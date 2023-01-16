import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";

import { formSchemaForProfile } from "../../../utils/TypeSchemas";

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
          showInstagram: true, // Boolian
          showFacebook: true, // Boolian
          showEmail: true, // Boolian
          createdAt: true, // String
          updatedAt: true, // String
        },
      });

      return user;
    }),

  getProfileDataByUserEmail: protectedProcedure
    .input(
      z.object({
        userEmail: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userEmail } = input;

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { email: userEmail },
        select: {
          id: true, // String
          name: true, // String
          email: true, // String
          posts: {
            include: {
              images: true,
              brand: true,
              category: true,
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
          showInstagram: true, // Boolian
          showFacebook: true, // Boolian
          showEmail: true, // Boolian
          createdAt: true, // String
          updatedAt: true, // String
        },
      });

      return user;
    }),

  updateProfile: protectedProcedure
    .input(formSchemaForProfile)
    .mutation(async ({ input, ctx }) => {
      const { email, ...data } = input;

      let phonenumber = data.phone;
      phonenumber?.startsWith("+")
        ? (phonenumber = phonenumber)
        : (phonenumber = data?.phone
            ?.toString()
            .replace("0", "+212") as string);

      let whatsappnumber = "";
      if (data.useSameNumber) {
        whatsappnumber = phonenumber;
      } else {
        whatsappnumber = data?.whatsapp?.toString() as string;
        whatsappnumber.startsWith("+")
          ? (whatsappnumber = whatsappnumber)
          : (whatsappnumber = data?.whatsapp
              ?.toString()
              .replace("0", "+212") as string);
      }

      const user = await ctx.prisma.user.update({
        where: { email: email },
        data: {
          ...data,
          whatsapp: whatsappnumber,
          phone: phonenumber,
        },
      });

      return user;
    }),
});
