import * as z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty(),
  displayName: z.string().nonempty(),
  gender: z.enum(["male", "female"]),
  congregationId: z.uuid(),
  permission: z.enum(["0", "1", "2", "3"]),
  lineSub: z.string().optional(),
  bindCode: z.string().optional(),
  cellphone: z.string(),
  telphone: z.string(),
  note: z.string(),
});

export const userKeySchema = userSchema.pick({ id: true, active: true, displayName: true });
export type User = z.infer<typeof userSchema>;
export type UserKey = z.infer<typeof userKeySchema>;
