import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSites } from "@/services/sites";
import { getUserKeys } from "@/services/users";
import { shiftSchema, type Shift } from "@/types/shift";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { AttendeeField } from "../form/AttendeesField";
import { DateField } from "../form/DateField";
import { NumberField } from "../form/NumberInput";
import { SelectField } from "../form/SelectField";
import { SwitchField } from "../form/SwitchField";
import { TimeField } from "../form/TimeField";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { FieldError, FieldGroup, FieldSet } from "../ui/field";

type Props = {
  editShiftObj: Shift | null;
  onClose: () => void;
};

export default function ShiftDialog({ editShiftObj, onClose }: Props) {
  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
  });
  const { data: userKeys } = useQuery({
    queryKey: ["userKeys"],
    queryFn: getUserKeys,
  });

  const form = useForm<Shift>({
    resolver: zodResolver(shiftSchema),
    defaultValues: editShiftObj
      ? { ...editShiftObj }
      : {
          id: v4(),
          active: true,
          date: dayjs().format("YYYY-MM-DD"),
          startTime: "09:00",
          endTime: "11:00",
          attendees: [],
          attendeesLimit: 2,
          yearMonth: dayjs().format("YYYY-MM"),
          isFull: false,
          requiredDeliverers: 0,
          expiredAt: dayjs().add(3, "months").toDate(),
        },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "attendees",
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const onDateChange = (date: string | undefined) => {
    if (date) {
      const yearMonth = dayjs(date).format("YYYY-MM");
      const expiredDate = dayjs(date).add(3, "month").toDate();
      form.setValue("expiredAt", expiredDate);
      form.setValue("yearMonth", yearMonth);
    }
  };

  const handleAddAttendee = () => {
    append("");
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    move(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const onSubmit = (data: Shift) => {
    //需要提前確認isFull屬性，並且更新
    console.log({ data });
  };

  return (
    <Dialog open onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editShiftObj ? "編輯" : "新增"}</DialogTitle>
          <DialogDescription>{editShiftObj ? "編輯" : "新增"}班次的設定與參與人員</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="setting">
            <TabsList>
              <TabsTrigger value="setting">基本設定</TabsTrigger>
              <TabsTrigger value="attendees">參與者</TabsTrigger>
            </TabsList>
            <TabsContent value="setting" className="py-5">
              <FieldSet>
                <FieldGroup>
                  <SwitchField control={form.control} name="active" label="啟用班次" />
                  <div className="grid grid-cols-2 gap-4">
                    <DateField control={form.control} name="date" label="日期" onDateChange={onDateChange} />
                    <SelectField
                      control={form.control}
                      name="siteId"
                      label="地點"
                      placeholder="選擇地點"
                      options={sites}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TimeField control={form.control} name="startTime" label="開始時間" placeholder="請輸入開始時間" />
                    <TimeField control={form.control} name="endTime" label="結束時間" placeholder="請輸入結束時間" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <NumberField control={form.control} name="attendeesLimit" label="班次人數上限" />
                    <NumberField control={form.control} name="requiredDeliverers" label="需要搬運人員" />
                  </div>
                </FieldGroup>
              </FieldSet>
            </TabsContent>
            <TabsContent value="attendees" className="py-5">
              <FieldSet>
                <FieldGroup>
                  <div className="space-y-2">
                    {fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">尚無參與者，點擊下方按鈕新增</p>
                    ) : (
                      fields.map((field, index) => (
                        <AttendeeField
                          key={field.id}
                          control={form.control}
                          index={index}
                          userKeys={userKeys}
                          watchAttendees={form.watch("attendees")}
                          onRemove={() => remove(index)}
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          isDragging={draggedIndex === index}
                        />
                      ))
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddAttendee}
                      className="flex items-center gap-1 w-full"
                    >
                      <Plus className="w-4 h-4" />
                      新增參與者
                    </Button>
                  </div>
                  {!!form.getFieldState("attendees").error?.root && (
                    <FieldError errors={[form.getFieldState("attendees").error?.root]} />
                  )}
                </FieldGroup>
              </FieldSet>
            </TabsContent>
          </Tabs>
          <Button type="submit" className="w-full mt-5">
            提交
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
