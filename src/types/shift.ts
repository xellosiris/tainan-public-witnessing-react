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
    attendeesLimit: z.number().int().nonnegative(), //0代表無限制
    attendeeCount: z.number().optional(),
    isFull: z.boolean(),
    requiredDeliverers: z.number().int().nonnegative(),
    expiredAt: z.date(),
  })
  .refine(
    (data) =>
      (data.attendeesLimit !== 0 &&
        data.requiredDeliverers <= data.attendeesLimit) ||
      data.attendeesLimit === 0,
    {
      message: "搬運者超過上限",
      path: ["attendeesLimit"],
    },
  )
  .refine(
    (data) =>
      (data.attendeesLimit !== 0 &&
        data.attendees.length <= data.attendeesLimit) ||
      data.attendeesLimit === 0,
    {
      message: "參加者超過上限",
      path: ["attendeesLimit"],
    },
  );

export type Shift = z.infer<typeof shiftSchema>;
