import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";
import { shiftFormSchema, type Shift, type ShiftForm } from "@/types/shift";
import type { Site } from "@/types/site";
import { type UserKey } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { AttendeeField } from "../form/fields/AttendeesField";
import { DateField } from "../form/fields/DateField";
import { NumberField } from "../form/fields/NumberInput";
import { SelectField } from "../form/fields/SelectField";
import { SwitchField } from "../form/fields/SwitchField";
import { TimeField } from "../form/fields/TimeField";

type Props = {
  editShiftObj: Shift | null;
  sites: Site[];
  userKeys: UserKey[];
  onClose: () => void;
};

export default function ShiftForm({ editShiftObj, sites, userKeys, onClose }: Props) {
  const form = useForm<ShiftForm>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: editShiftObj
      ? {
          ...editShiftObj,
          attendees: editShiftObj.attendees.map((attendee) => userKeys.find((u) => u.id === attendee)),
        }
      : {
          id: v4(),
          active: true,
          date: dayjs().format("YYYY-MM-DD"),
          startTime: "09:00",
          endTime: "11:00",
          attendees: [],
          attendeesLimit: 4,
          requiredDeliverers: 0,
          expiredAt: dayjs().toDate(),
          yearMonth: dayjs().format("YYYY-MM"),
          isFull: true,
        },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "attendees",
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddAttendee = () => {
    const currentLimit = form.watch("attendeesLimit");
    if (fields.length >= currentLimit) {
      alert("已達到人數上限");
      return;
    }
    append({ id: "", displayName: "", active: false });
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

  const onSubmit = (data: ShiftForm) => {
    const shift = {
      ...data,
      attendees: data.attendees.map((attendee) => attendee.id),
    };
    console.log({ shift });
    onClose();
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <SwitchField control={form.control} name="active" label="啟用班次" />
            <div className="grid grid-cols-2 gap-4">
              <DateField control={form.control} name="date" label="日期" />
              <SelectField control={form.control} name="siteId" label="地點" placeholder="選擇地點" options={sites} />
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
        <FieldSeparator>參與人員</FieldSeparator>
        <FieldSet>
          <FieldGroup>
            <div className="space-y-2">
              {fields.length === 0 ? (
                <p className="py-4 text-sm text-center text-muted-foreground">尚無參與者，點擊下方按鈕新增</p>
              ) : (
                fields.map((field, index) => (
                  <AttendeeField
                    key={field.id}
                    control={form.control}
                    index={index}
                    userKeys={userKeys}
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
                className="flex items-center w-full gap-1"
              >
                <Plus className="w-4 h-4" />
                新增參與者
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
      <Button type="submit" className="w-full mt-5">
        提交
      </Button>
    </form>
  );
}
