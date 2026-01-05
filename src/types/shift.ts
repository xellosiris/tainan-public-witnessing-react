import dayjs from "dayjs";
import * as z from "zod";
import { userKeySchema } from "./user";

export const shiftSchema = z.object({
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
});

export const shiftFormSchema = shiftSchema
  .extend({
    attendees: userKeySchema.array(),
  })
  .transform((data) => ({
    ...data,
    expiredAt: dayjs(data.date).add(6, "months").toDate(),
    yearMonth: dayjs(data.date).format("YYYY-MM"),
    isFull: data.attendees.length >= data.attendeesLimit,
  }))
  .refine((data) => data.requiredDeliverers <= data.attendeesLimit, {
    message: "搬運者超過上限",
    path: ["attendeesLimit"],
  })
  .refine((data) => data.attendees.length <= data.attendeesLimit, {
    message: "參加者超過上限",
    path: ["attendeesLimit"],
  });

export type ShiftForm = z.infer<typeof shiftFormSchema>;
export type Shift = z.infer<typeof shiftSchema>;
