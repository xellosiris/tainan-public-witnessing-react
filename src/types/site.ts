import * as z from "zod";

export const siteSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().max(8).nonempty("名稱不可空白"),
  description: z.string().optional(),
  siteShifts: z.uuid().array(),
});

export const siteKeySchema = siteSchema.pick({
  id: true,
  name: true,
  active: true,
});
export type Site = z.infer<typeof siteSchema>;
export type SiteKey = z.infer<typeof siteKeySchema>;
