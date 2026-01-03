import * as z from "zod";

export const congregationSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty(),
});

export type Congregation = z.infer<typeof congregationSchema>;
