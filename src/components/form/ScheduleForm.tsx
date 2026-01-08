import { getEnrolledShifts } from "@/lib/shiftUtils";
import { scheduleSchema, type Schedule } from "@/types/schedule";
import type { SiteKey } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import SignupShiftDialog from "../dialog/SignupShiftDialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { AttendeeField } from "./fields/AttendeeField";
import { DateField } from "./fields/DateField";
import { SwitchField } from "./fields/SwitchField";
import ShiftGroupedView from "./ShiftGroupedView";

type Props = { editScheduleObj: Schedule | null; siteKeys: SiteKey[]; siteShifts: SiteShift[] };

export default function ScheduleForm({ editScheduleObj, siteKeys, siteShifts }: Props) {
  const form = useForm<Schedule>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: editScheduleObj
      ? { ...editScheduleObj }
      : {
          canSchedule: true,
          siteShiftLimits: {},
          unavailableDates: [],
          partnerId: "",
        },
  });

  const onSubmit = (data: Schedule) => {
    console.log({ data });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="pb-24">
      <FieldGroup>
        <FieldSet className="max-w-lg">
          <FieldLegend>排班設定</FieldLegend>
          <FieldGroup className="bg-white p-4 rounded-md shadow-sm">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>參與排班</ItemTitle>
                <ItemDescription>啟用此排程可用於排班系統</ItemDescription>
              </ItemContent>
              <ItemActions>
                <SwitchField name="canSchedule" label="啟用" control={form.control} />
              </ItemActions>
            </Item>
            <AttendeeField name="partnerId" control={form.control} label="同伴" placeholder="請輸入同伴名字..." />
            <DateField name="unavailableDates" mode="multiple" control={form.control} label="無法參與日期" />
          </FieldGroup>
        </FieldSet>

        <FieldSet className="max-w-4xl">
          <div className="flex items-center justify-between">
            <FieldLegend>參與班次設定</FieldLegend>
            <Controller
              name="siteShiftLimits"
              control={form.control}
              render={({ field }) => (
                <SignupShiftDialog
                  siteShifts={siteShifts}
                  siteKeys={siteKeys}
                  currentLimits={field.value}
                  onUpdateLimits={(newLimits) => {
                    field.onChange(newLimits);
                  }}
                />
              )}
            />
          </div>
          <Controller
            name="siteShiftLimits"
            control={form.control}
            render={({ field, fieldState }) => {
              const enrolledShifts = useMemo(() => {
                return getEnrolledShifts(field.value, siteShifts).filter((shift) => shift.active);
              }, [field.value]);
              return (
                <Field className="bg-white p-4 rounded-md shadow-sm">
                  <ShiftGroupedView
                    siteShifts={enrolledShifts}
                    siteKeys={siteKeys}
                    renderShift={(siteShift: SiteShift) => {
                      const maxTimes = field.value[siteShift.id];
                      return (
                        <div className="flex items-center justify-between p-3 bg-white border border-secondary rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-lg">
                              {siteShift.startTime} ～ {siteShift.endTime}
                            </h5>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">報名次數</span>
                            <p className="text-2xl font-semibold text-primary">{maxTimes}</p>
                          </div>
                        </div>
                      );
                    }}
                    emptyState={
                      <div className="text-center py-12 text-gray-500">
                        <p>尚未報名任何班次</p>
                        <p className="text-sm mt-2">請點擊上方「我要報名」按鈕新增</p>
                      </div>
                    }
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </FieldSet>
      </FieldGroup>

      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-2xl mx-auto">
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="w-full" size="lg">
            儲存
          </Button>
        </div>
      </div>
    </form>
  );
}
