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
  cellphone: z.string(),
  telephone: z.string().optional(),
  note: z.string().optional(),
  lineSub: z.string().optional(),
  bindCode: z.string().optional(),
  firebaseSub: z.string().optional(),
  availableSiteShifts: z.uuid().array(),
});

export const userKeySchema = userSchema.pick({ id: true, active: true, displayName: true });
export type User = z.infer<typeof userSchema>;
export type UserKey = z.infer<typeof userKeySchema>;
