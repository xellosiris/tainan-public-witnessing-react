import * as z from "zod";

const scheduleSchema = z.object({
  userId: z.uuid(),
  assign: z.boolean(),
  availableShifts: z.record(z.uuid(), z.number().int().nonnegative()),
  unavailableDates: z.string().array(),
  partnerId: z.uuid(),
});

export type Schedule = z.infer<typeof scheduleSchema>;
