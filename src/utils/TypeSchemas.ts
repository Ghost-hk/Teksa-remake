import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(8).max(100),
  description: z.string().nullable().optional(),
  price: z.number(),
  sexe: z.enum(["Male", "Female"]),
  size: z.string().min(1),
  images: z
    .string()
    .array()
    .nonempty({
      message: "Each item must have at least one image",
    })
    .max(5)
    .nullable(),
  category: z.string().min(1),
  brand: z.string().min(1),
  userEmail: z.string(),
  id: z.string().optional(),
});

export const formErrorsSchema = z.object({
  state: z.boolean().default(false),
  title: z.array(z.string()).optional(),
  price: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  sexe: z.array(z.string()).optional(),
  brand: z.array(z.string()).optional(),
  category: z.array(z.string()).optional(),
  images: z
    .string()
    .array()
    .nonempty({
      message: "Each item must have at least one image",
    })
    .max(5)
    .optional(),
});
