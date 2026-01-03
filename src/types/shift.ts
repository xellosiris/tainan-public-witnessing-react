import * as z from "zod";

const shiftSchema = z
  .object({
    id: z.uuid(),
    active: z.boolean(),
    date: z.string().nonempty(),
    yearMonth: z.string(),
    siteId: z.uuid(),
    startTime: z.string().nonempty(),
    endTime: z.string().nonempty(),
    attendees: z.uuid().array(),
    attendeesLimit: z.number().positive(),
    isFull: z.boolean(),
    requiredDeliverers: z.number().positive().default(2),
    expiredAt: z.date(),
  })
  .refine((data) => data.attendees.length <= data.attendeesLimit, {
    message: "參與人員的總人數不能超過參與上限",
    path: ["crewUuids"],
  });

export type Shift = z.infer<typeof shiftSchema>;
