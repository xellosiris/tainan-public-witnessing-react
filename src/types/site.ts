import * as z from "zod";
import { siteShiftSchema } from "./siteShift";

export const siteSchema = z.object({
  id: z.nanoid(),
  active: z.boolean(),
  name: z.string().max(8).nonempty("名稱不可空白"),
  description: z.string().optional(),
  siteShifts: siteShiftSchema.array(),
});

export const siteKeySchema = siteSchema.pick({
  id: true,
  name: true,
  active: true,
});
export type Site = z.infer<typeof siteSchema>;
export type SiteKey = z.infer<typeof siteKeySchema>;
