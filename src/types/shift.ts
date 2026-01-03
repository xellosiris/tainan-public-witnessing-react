import * as z from "zod";

const shiftSchema = z
  .object({
    id: z.uuid(),
    active: z.boolean(),
    date: z.string().nonempty(),
    siteUuid: z.uuid(),
    startTime: z.string().nonempty(),
    endTime: z.string().nonempty(),
    attendees: z.uuid().array(),
    hasStatistic: z.boolean().optional(),
    attendeesLimit: z.number().positive(),
    requiredDeliverers: z.number().positive().default(2),
  })
  .refine((data) => data.attendees.length <= data.attendeesLimit, {
    message: "參與人員的總人數不能超過參與上限",
    path: ["crewUuids"],
  });

export type Shift = z.infer<typeof shiftSchema>;
