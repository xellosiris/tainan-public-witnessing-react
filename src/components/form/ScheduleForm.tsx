import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { getEnrolledShifts } from "@/lib/shiftUtils";
import { getNextDeadlineDate } from "@/lib/utils";
import { getSetting } from "@/services/setting";
import { type Schedule, scheduleSchema } from "@/types/schedule";
import type { SiteKey } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import SignupShiftDialog from "../dialog/SignupShiftDialog";
import { AttendeeField } from "./fields/AttendeeField";
import { DateField } from "./fields/DateField";
import { SwitchField } from "./fields/SwitchField";
import ShiftGroupedView from "./ShiftGroupedView";

type Props = {
  editScheduleObj: Schedule | null;
  siteKeys: SiteKey[];
  siteShifts: SiteShift[];
};

export default function ScheduleForm({
  editScheduleObj,
  siteKeys,
  siteShifts,
}: Props) {
  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });
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
    alert(`下次生效日：${getNextDeadlineDate(3).format("YYYY-MM-DD")}`);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>排班設定</FieldLegend>
          <FieldGroup className="p-4 bg-white rounded-md shadow-sm">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>參與排班</ItemTitle>
                <ItemDescription>
                  啟用後，會參與自動排班。關閉後，使用者會暫停排班
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <SwitchField
                  name="canSchedule"
                  label="啟用"
                  control={form.control}
                />
              </ItemActions>
            </Item>
            <AttendeeField
              name="partnerId"
              control={form.control}
              label="同伴"
              placeholder="請輸入同伴名字..."
            />
            <DateField
              name="unavailableDates"
              mode="multiple"
              control={form.control}
              label="無法參與日期"
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet>
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
                return getEnrolledShifts(field.value, siteShifts).filter(
                  (shift) => shift.active,
                );
              }, [field.value]);
              return (
                <Field className="p-4 bg-white rounded-md shadow-sm">
                  <ShiftGroupedView
                    siteShifts={enrolledShifts}
                    siteKeys={siteKeys}
                    renderShift={(siteShift: SiteShift) => {
                      const maxTimes = field.value[siteShift.id];
                      return (
                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg border-secondary">
                          <div className="flex-1">
                            <h5 className="text-2xl font-medium">
                              {siteShift.startTime} ～ {siteShift.endTime}
                            </h5>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">
                              報名次數
                            </span>
                            <p className="text-2xl font-semibold text-primary">
                              {maxTimes}
                            </p>
                          </div>
                        </div>
                      );
                    }}
                    emptyState={
                      <div className="py-12 text-center text-gray-500">
                        <p>尚未報名任何班次</p>
                        <p className="mt-2 text-sm">
                          請點擊上方「我要報名」按鈕新增
                        </p>
                      </div>
                    }
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldSet>
      </FieldGroup>

      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-sm mx-auto">
          <Button type="submit" className="w-full" size="lg">
            儲存
          </Button>
        </div>
      </div>
    </form>
  );
}
