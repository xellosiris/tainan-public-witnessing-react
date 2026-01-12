import { WEEKDAY_OPTIONS } from "@/assets/date";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import type { Setting } from "@/types/setting";
import { type SiteShift, siteShiftSchemaWithOverlapCheck } from "@/types/siteShift";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";

import type z from "zod";
import { NumberField } from "../form/fields/NumberInput";
import { SelectField } from "../form/fields/SelectField";
import { SwitchField } from "../form/fields/SwitchField";
import { TimeField } from "../form/fields/TimeField";

type Props = {
  siteId: string;
  existSiteShifts: SiteShift[];
  onOpenChange: () => void;
  siteShiftEditObj: SiteShift | null;
  onSave: (shift: SiteShift) => void;
  setting: Setting;
};

export default function SiteShiftFormDialog({
  siteId,
  existSiteShifts,
  onOpenChange,
  siteShiftEditObj,
  onSave,
  setting,
}: Props) {
  const schema = siteShiftSchemaWithOverlapCheck(existSiteShifts);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: siteShiftEditObj || {
      id: nanoid(),
      siteId,
      active: true,
      attendeesLimit: setting.defaultAttendeesLimit,
      startTime: "09:00",
      endTime: "17:00",
      weekday: 6,
      requiredDeliverers: setting.defaultRequiredDeliverers,
    },
  });

  const handleSubmit = (data: SiteShift) => {
    onSave(data);
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{siteShiftEditObj ? "編輯班次" : "新增班次"}</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <SwitchField name="active" label="啟用此班次" control={form.control} />
          <SelectField name="weekday" label="星期" control={form.control} options={WEEKDAY_OPTIONS} valueAsNumber />
          <div className="grid grid-cols-2 gap-4">
            <TimeField name="startTime" label="開始時間" control={form.control} />
            <TimeField name="endTime" label="結束時間" control={form.control} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberField name="attendeesLimit" label="人數上限" control={form.control} />
            <NumberField name="requiredDeliverers" label="參與運送人數" control={form.control} />
          </div>
        </FieldGroup>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onOpenChange}>
            取消
          </Button>
          <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
