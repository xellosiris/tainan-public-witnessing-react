import * as z from "zod";

export const scheduleSchema = z.object({
  canSchedule: z.boolean(),
  siteShiftLimits: z.record(z.uuid(), z.number().int().nonnegative()),
  unavailableDates: z.string().array(),
  partnerId: z.union([z.uuid(), z.literal("")]),
});

export type Schedule = z.infer<typeof scheduleSchema>;
