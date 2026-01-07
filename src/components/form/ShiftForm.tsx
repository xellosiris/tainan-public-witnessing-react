import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";
import { shiftFormSchema, type Shift, type ShiftForm } from "@/types/shift";
import type { Site } from "@/types/site";
import { type UserKey } from "@/types/user";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
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

  // 設定拖移感應器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 移動 8px 後才開始拖移，避免誤觸
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddAttendee = () => {
    const currentLimit = form.watch("attendeesLimit");
    if (fields.length >= currentLimit) {
      alert("已達到人數上限");
      return;
    }
    append({ id: "", displayName: "", active: false });
  };

  // 處理拖移結束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
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
              <NumberField control={form.control} name="attendeesLimit" label="人數上限（0表示無限制)" />
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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                    {fields.map((field, index) => (
                      <AttendeeField
                        key={field.id}
                        id={field.id}
                        control={form.control}
                        index={index}
                        userKeys={userKeys}
                        onRemove={() => remove(index)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
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
