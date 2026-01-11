import type { Timestamp } from "firebase/firestore/lite";
import * as z from "zod";

export const shiftSchema = z.object({
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
});

export type Shift = z.infer<typeof shiftSchema>;
export type rawShift = Shift & { expiredAt: Timestamp };
