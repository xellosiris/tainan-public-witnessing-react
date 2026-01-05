import * as z from "zod";
import { userKeySchema } from "./user";

const settingSchema = z.object({
  name: z.string(),
  userKeys: userKeySchema.array(),
  scheduleDayOfMonth: z.number().int().min(1).max(31),
  participationLimit: z.number().int().nonnegative(),
});

export type Setting = z.infer<typeof settingSchema>;
