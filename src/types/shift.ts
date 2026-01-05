import * as z from "zod";

export const shiftSchema = z
  .object({
    id: z.uuid(),
    active: z.boolean(),
    date: z.string().nonempty(),
    yearMonth: z.string(),
    siteId: z.uuid(),
    startTime: z.string().nonempty(),
    endTime: z.string().nonempty(),
    attendees: z.uuid().array(),
    attendeesLimit: z.number().int().positive(),
    isFull: z.boolean(),
    requiredDeliverers: z.number().int().nonnegative(),
    expiredAt: z.date(),
  })
  .refine((data) => data.attendees.length <= data.attendeesLimit, {
    message: "參與者超過上限",
    path: ["attendees"],
  })
  .refine((data) => data.requiredDeliverers <= data.attendeesLimit, {
    message: "搬運者超過上限",
    path: ["requiredDeliverers"],
  });

export type Shift = z.infer<typeof shiftSchema>;
