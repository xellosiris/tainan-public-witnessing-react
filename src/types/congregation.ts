import * as z from "zod";

export const congSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty(),
});
export type Cong = z.infer<typeof congSchema>;
