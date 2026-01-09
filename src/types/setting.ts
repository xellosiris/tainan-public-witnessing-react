import * as z from "zod";
import { siteKeySchema } from "./site";
import { userKeySchema } from "./user";

export const settingSchema = z.object({
  name: z.string().max(15),
  userKeys: userKeySchema.array(),
  siteKeys: siteKeySchema.array(),
  scheduleDayOfMonth: z.number().int().min(1).max(31),
  participationLimit: z.number().int().nonnegative(),
});

export type Setting = z.infer<typeof settingSchema>;
