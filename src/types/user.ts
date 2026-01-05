import { PERMISSION } from "@/assets/permission";
import * as z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty(),
  displayName: z.string().nonempty(),
  gender: z.enum(["male", "female"]),
  congId: z.uuid(),
  permission: z.enum(PERMISSION),
  firebaseSub: z.string(),
  lineSub: z.string().optional(),
  bindCode: z.string().optional(),
  cellphone: z.string(),
  telephone: z.string().optional().default(""),
  note: z.string().optional().default(""),
});

export const userKeySchema = userSchema.pick({ id: true, active: true, displayName: true });
export type User = z.infer<typeof userSchema>;
export type UserKey = z.infer<typeof userKeySchema>;
