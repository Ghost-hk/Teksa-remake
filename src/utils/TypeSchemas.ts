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

export const formSchemaForProfile = z.object({
  name: z.string().min(6).max(16),
  email: z.string().email(),
  size: z.string().optional(),
  sexe: z.enum(["Male", "Female", ""]).optional(),
  // phone: z.number().or(z.nan()),
  phone: z.string().optional(),
  whatsapp: z.number().optional().or(z.nan()),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(3),
  showPhone: z.boolean().optional().default(true),
  showWhatsapp: z.boolean().optional().default(true),
  useSameNumber: z.boolean().optional().default(true),
  showInstagram: z.boolean().optional().default(true),
  showFacebook: z.boolean().optional().default(true),
  showEmail: z.boolean().optional().default(false),
});
