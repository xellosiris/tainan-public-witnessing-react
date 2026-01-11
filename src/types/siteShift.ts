import { hasShiftTimeOverlap } from "@/lib/shiftUtils";
import * as z from "zod";

export const siteShiftSchema = z
  .object({
    id: z.uuid(),
    siteId: z.uuid(),
    active: z.boolean(),
    attendeesLimit: z.number().int().nonnegative(),
    startTime: z.string().nonempty(),
    endTime: z.string().nonempty(),
    weekday: z.number().min(0).max(6),
    requiredDeliverers: z.number().int().nonnegative(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "開始時間必須早於結束時間",
    path: ["endTime"],
  });

export const siteShiftSchemaWithOverlapCheck = (existingShifts: SiteShift[]) =>
  siteShiftSchema.superRefine((data, ctx) => {
    if (hasShiftTimeOverlap(data, existingShifts)) {
      ctx.addIssue({
        code: "custom",
        message: "此班次與其他班次時間重疊",
        path: ["startTime"],
      });
    }
  });

export type SiteShift = z.infer<typeof siteShiftSchema>;
