// ScheduleForm.tsx
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { Schedule } from "@/types/schedule";
import { scheduleSchema } from "@/types/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useState } from "react";
import { zhTW } from "react-day-picker/locale";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "../ui/field";
import { AttendeeField } from "./fields/AttendeeField";
import { SwitchField } from "./fields/SwitchField";

type Props = {
  scheduleEditObj: Schedule | null;
  onSubmit?: (data: Schedule) => void;
};

export default function ScheduleForm({ scheduleEditObj, onSubmit: onSubmitProp }: Props) {
  const form = useForm<Schedule>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: !!scheduleEditObj
      ? { ...scheduleEditObj }
      : {
          canSchedule: true,
          availableSiteShifts: [],
          unavailableDates: [],
          partnerId: "",
        },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "availableSiteShifts",
  });

  const [newSiteShiftId, setNewSiteShiftId] = useState("");
  const [newTimes, setNewTimes] = useState(1);

  const handleAddSiteShift = () => {
    if (newSiteShiftId.trim()) {
      append({ siteShiftId: newSiteShiftId, times: newTimes });
      setNewSiteShiftId("");
      setNewTimes(1);
    }
  };

  const onSubmit = (data: Schedule) => {
    console.log("提交資料:", data);

    if (onSubmitProp) {
      onSubmitProp(data);
    }
  };

  return (
    <>
      <div className="pb-20 space-y-6">
        <FieldGroup>
          <FieldSet className="max-w-lg">
            <FieldLegend>基本設定</FieldLegend>
            <FieldSeparator />
            <FieldGroup>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>可以參與排班</ItemTitle>
                  <ItemDescription>啟用後此排程可用於排班系統</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <SwitchField name="canSchedule" label="啟用" control={form.control} />
                </ItemActions>
              </Item>
              <AttendeeField name="partnerId" control={form.control} label="同伴" placeholder="請輸入同伴名字..." />
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldSeparator />
            <FieldLegend>無法參加的日期</FieldLegend>
            <Controller
              name="unavailableDates"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <Calendar
                    classNames={{
                      root: "shrink-0 w-full max-w-xs border rounded-md",
                      day: "h-10 w-10 p-0 mx-auto",
                      row: "mt-1",
                      day_button: "rounded-full",
                      caption_label: "text-xl",
                    }}
                    mode="multiple"
                    selected={field.value.map((d) => dayjs(d).toDate())}
                    onSelect={(selectedDates: Date[] | undefined) => {
                      const dateStrings = selectedDates
                        ? selectedDates.map((date) => dayjs(date).format("YYYY-MM-DD"))
                        : [];
                      field.onChange(dateStrings);
                    }}
                    locale={zhTW}
                    footer={
                      field.value.length > 0 && (
                        <div className="text-sm text-center text-muted-foreground pt-3">
                          共 {field.value.length} 個無法參與日期
                        </div>
                      )
                    }
                  />

                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldSet>
          <FieldSet className="max-w-4xl">
            <FieldSeparator />
            <FieldLegend>參與班次設定</FieldLegend>

            {/* 班次列表 */}
            {fields.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">尚無設定班次，請使用上方表單新增班次</p>
              </div>
            )}

            {fields.length > 0 && (
              <div className="text-sm text-center text-muted-foreground">共 {fields.length} 個班次</div>
            )}
          </FieldSet>
        </FieldGroup>
      </div>

      {/* Fixed submit button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-2xl mx-auto">
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="w-full" size="lg">
            儲存
          </Button>
        </div>
      </div>
    </>
  );
}
