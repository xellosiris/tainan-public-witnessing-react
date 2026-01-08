import * as z from "zod";

export const scheduleSchema = z.object({
  canSchedule: z.boolean(),
  availableSiteShifts: z.object({ siteShiftId: z.uuid(), times: z.number().int().nonnegative() }).array(),
  unavailableDates: z.string().array(),
  partnerId: z.uuid().optional(),
});

export type Schedule = z.infer<typeof scheduleSchema>;
