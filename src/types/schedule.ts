import * as z from "zod";

export const scheduleSchema = z.object({
  userId: z.nanoid(),
  canSchedule: z.boolean(),
  siteShiftLimits: z.record(z.nanoid(), z.number().int().nonnegative()),
  unavailableDates: z.string().array(),
  partnerId: z.union([z.nanoid(), z.literal("")]),
});

export type Schedule = z.infer<typeof scheduleSchema>;
