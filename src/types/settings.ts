import * as z from "zod";
import { userKeySchema } from "./user";

const settingSchema = z.object({
  name: z.string(),
  userKeys: userKeySchema.array(),
});

export type Setting = z.infer<typeof settingSchema>;
