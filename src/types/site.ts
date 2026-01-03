import * as z from "zod";

export const siteShiftSchema = z.object({
  active: z.boolean(),
  attendeesLimit: z.number().positive(),
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
  weekday: z.number().min(0).max(6),
});

export const siteSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
  name: z.string().nonempty("名稱不可空白"),
  description: z.string().optional(),
  googleLink: z.string().optional(),
  siteShifts: siteShiftSchema.array(),
});

export type Site = z.infer<typeof siteSchema>;
