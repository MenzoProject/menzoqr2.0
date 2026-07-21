import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().max(255).optional().or(z.literal("")),
  subtitle: z.string().max(500).optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
