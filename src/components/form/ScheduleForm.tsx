import { user } from "@/App";
import { PERMISSION } from "@/assets/permission";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { getScheduleDeadline } from "@/lib/utils";
import { updateSchedule } from "@/services/schedule";
import { type Schedule, scheduleSchema } from "@/types/schedule";
import type { Setting } from "@/types/setting";
import type { SiteShift } from "@/types/siteShift";
import type { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { zhTW } from "react-day-picker/locale";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import SignupSiteShiftDialog from "../dialog/SignupSiteShiftDialog";
import { Calendar } from "../ui/calendar";
import { Loading } from "../ui/loading";
import { AttendeeField } from "./fields/AttendeeField";
import { DateField } from "./fields/DateField";
import { SwitchField } from "./fields/SwitchField";
import SiteShiftList from "./SiteShiftList";

type Props = {
  editScheduleObj: Schedule | null;
  setting: Setting;
  userId: User["id"];
};

export default function ScheduleForm({ editScheduleObj, setting, userId }: Props) {
  const { permission } = user;
  const { siteKeys } = setting;

  const queryClient = useQueryClient();

  const form = useForm<Schedule>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: editScheduleObj
      ? { ...editScheduleObj }
      : {
          userId,
          canSchedule: true,
          siteShiftLimits: {},
          unavailableDates: [],
          partnerId: "",
        },
  });

  const onSubmit = (data: Schedule) => {
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: (schedule: Schedule) => updateSchedule(schedule),
    onSuccess: () => {
      toast.success("更新排班成功", {
        description: `排班生效日：${getScheduleDeadline(setting.scheduleDayOfMonth).format("YYYY-MM-DD")}`,
      });
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
    },
    onError: () => toast.error("更新排班失敗", { description: "請再次嘗試" }),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="pb-20">
      {mutation.isPending && <Loading />}
      <FieldGroup>
        {permission < PERMISSION.Publisher && (
          <FieldSet>
            <FieldLegend>排班設定</FieldLegend>
            <FieldGroup className="p-4 bg-white rounded-md shadow-sm">
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>自動排班</ItemTitle>
                  <ItemDescription>啟用後，會參與自動排班。關閉後，使用者會暫停排班，但可以手動排班</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <SwitchField name="canSchedule" label="啟用" control={form.control} />
                </ItemActions>
              </Item>
              <AttendeeField
                name="partnerId"
                control={form.control}
                label="同伴"
                excludeUserIds={[userId]}
                disabledUserIds={setting?.userKeys.filter((u) => !u.active).map((u) => u.id)}
              />
              <DateField name="unavailableDates" mode="multiple" control={form.control} label="無法參與日期" />
            </FieldGroup>
          </FieldSet>
        )}
        {permission >= PERMISSION.Publisher && (
          <FieldSet>
            <FieldLegend>無法參與排班的日期</FieldLegend>
            <Controller
              name="unavailableDates"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    mode="multiple"
                    locale={zhTW}
                    selected={field.value.map((v) => dayjs(v).toDate())}
                    onSelect={(dates) => field.onChange(dates?.map((d) => dayjs(d).format("YYYY-MM-DD")))}
                    classNames={{
                      root: "shrink-0 w-full max-w-xs border rounded-md",
                      day: "h-10 w-10 p-0 mx-auto",
                      row: "mt-1",
                      day_button: "rounded-full",
                      caption_label: "text-xl",
                    }}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </>
              )}
            />
          </FieldSet>
        )}

        <FieldSet>
          <div className="flex items-center justify-between">
            <FieldLegend>參與班次設定</FieldLegend>
            <Controller
              name="siteShiftLimits"
              control={form.control}
              render={({ field }) => (
                <SignupSiteShiftDialog
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
              return (
                <Field className="p-4 bg-white rounded-md shadow-sm">
                  <SiteShiftList
                    siteKeys={siteKeys}
                    filterShifts={(shift) =>
                      field.value[shift.id] !== undefined && field.value[shift.id] > 0 && shift.active
                    }
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
                            <span className="text-sm text-gray-500">報名次數</span>
                            <p className="text-2xl font-semibold text-primary">{maxTimes ?? 0}</p>
                          </div>
                        </div>
                      );
                    }}
                    emptyState={
                      <div className="py-12 text-center text-gray-500">
                        <p>尚未報名任何班次</p>
                        <p className="mt-2 text-sm">請點擊上方「報名（修改）」按鈕新增</p>
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
        <div className="max-w-sm mx-auto">
          <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending || !form.formState.isDirty}>
            儲存
          </Button>
        </div>
      </div>
    </form>
  );
}
