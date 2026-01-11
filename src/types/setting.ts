import * as z from "zod";
import { congSchema } from "./congregation";
import { siteKeySchema } from "./site";
import { userKeySchema } from "./user";

export const settingSchema = z.object({
  name: z.string().max(15),
  userKeys: userKeySchema.array(),
  siteKeys: siteKeySchema.array(),
  scheduleDayOfMonth: z.number().int().min(1).max(31),
  defaultAttendeesLimit: z.number().int().min(1),
  defaultRequiredDeliverers: z.number().int(),
  participationLimit: z.number().int().nonnegative(),
  congs: congSchema.array(),
});

export type Setting = z.infer<typeof settingSchema>;
