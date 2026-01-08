import * as z from "zod";
import { siteShiftSchema } from "./siteShift";

export const siteSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty("名稱不可空白"),
  description: z.string().optional(),
  siteShifts: z.uuid().array(),
});
export const siteKeySchema = siteSchema.pick({ id: true, name: true, active: true });
export const siteFormSchema = siteSchema.extend({ siteShifts: siteShiftSchema.array() });
export type Site = z.infer<typeof siteSchema>;
export type SiteKey = z.infer<typeof siteKeySchema>;
export type SiteForm = z.infer<typeof siteFormSchema>;
