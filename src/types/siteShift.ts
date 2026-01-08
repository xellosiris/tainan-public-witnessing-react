import * as z from "zod";

export const siteShiftSchema = z.object({
  id: z.uuid(),
  siteId: z.uuid(),
  active: z.boolean(),
  attendeesLimit: z.number().int().nonnegative(),
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
  weekday: z.number().min(0).max(6),
  requiredDeliverers: z.number(),
});
export type SiteShift = z.infer<typeof siteShiftSchema>;
