import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { siteShiftSchema, type SiteShift } from "@/types/siteShift";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { NumberField } from "../form/fields/NumberInput";
import { SelectField } from "../form/fields/SelectField";
import { SwitchField } from "../form/fields/SwitchField";
import { TimeField } from "../form/fields/TimeField";

const weekdayOptions = [
  { id: "0", name: "週一" },
  { id: "1", name: "週二" },
  { id: "2", name: "週三" },
  { id: "3", name: "週四" },
  { id: "4", name: "週五" },
  { id: "5", name: "週六" },
  { id: "6", name: "週日" },
];

type Props = {
  siteId: string;
  onOpenChange: (open: boolean) => void;
  siteShift: SiteShift | null;
  onSave: (shift: SiteShift) => void;
};

export default function SiteShiftFormDialog({ siteId, onOpenChange, siteShift, onSave }: Props) {
  const form = useForm<SiteShift>({
    resolver: zodResolver(siteShiftSchema),
    defaultValues: siteShift || {
      id: v4(),
      siteId,
      active: true,
      attendeesLimit: 4,
      startTime: "09:00",
      endTime: "17:00",
      weekday: 6,
      requiredDeliverers: 0,
    },
  });

  const handleSubmit = (data: SiteShift) => {
    console.log({ data });
    onSave(data);
    form.reset();
  };
  console.log({ error: form.formState.errors });
  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{siteShift ? "編輯班次" : "新增班次"}</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <SwitchField name="active" label="啟用此班次" control={form.control} />
          <SelectField name="weekday" label="星期" control={form.control} options={weekdayOptions} valueAsNumber />
          <div className="grid grid-cols-2 gap-4">
            <TimeField name="startTime" label="開始時間" control={form.control} />
            <TimeField name="endTime" label="結束時間" control={form.control} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberField name="attendeesLimit" label="人數上限" control={form.control} />
            <NumberField name="requiredDeliverers" label="參與運送人數" control={form.control} />
          </div>
        </FieldGroup>
        <Alert variant={"destructive"}>
          <AlertTriangleIcon />
          <AlertTitle>請確認</AlertTitle>
          <AlertDescription>新增班次前，請先確認是否有重複時段的班次</AlertDescription>
        </Alert>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
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
