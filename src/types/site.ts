import * as z from "zod";

export const siteShiftSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  attendeesLimit: z.number().int().nonnegative(),
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
  weekday: z.number().min(0).max(6),
  requiredDeliverers: z.number(),
});

export const siteSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty("名稱不可空白"),
  description: z.string().optional(),
  siteShifts: siteShiftSchema.array(),
});

export const siteKeySchema = siteSchema.pick({ id: true, name: true, active: true });

export type Site = z.infer<typeof siteSchema>;
export type SiteShift = z.infer<typeof siteShiftSchema>;
export type SiteKey = z.infer<typeof siteSchema>;
