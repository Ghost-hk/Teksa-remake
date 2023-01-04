import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(8).max(100),
  description: z.string().min(8).max(255).optional(),
  price: z.number(),
  sexe: z.enum(["Male", "Female"]),
  size: z.string(),
  images: z
    .array(z.string())
    .nonempty({
      message: "Each item must have at least one image",
    })
    .max(5),
  category: z.string(),
  brand: z.string(),
  userEmail: z.string(),
});
