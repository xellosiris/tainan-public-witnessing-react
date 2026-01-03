import * as z from "zod";

const scheduleSchema = z.object({
  memberId: z.uuid(),
  assign: z.boolean(),
  availableShifts: z
    .object({
      id: z.uuid(),
      limit: z.number(),
    })
    .array(),
  unavailableDates: z.string().array(),
  partnerId: z.uuid(),
});

export type Schedule = z.infer<typeof scheduleSchema>;
