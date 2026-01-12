import UsersCombobox from "@/components/Combobox/UsersCombobox";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { User, UserKey } from "@/types/user";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import type z from "zod";
import type { schema } from "../ShiftForm";

type AttendeeFieldProps = {
  control: Control<z.infer<typeof schema>>;
  index: number;
  id: string;
  userKeys: Array<UserKey>;
  onRemove: () => void;
};

export function AttendeesField({ control, index, id, userKeys, onRemove }: AttendeeFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-1 border rounded-lg bg-background transition-all",
        isDragging && "opacity-50 z-50"
      )}
    >
      <button type="button" className="cursor-grab active:cursor-grabbing touch-none" {...attributes} {...listeners}>
        <GripVertical className="w-5 h-5 text-muted-foreground shrink-0" />
      </button>

      <div className="flex-1">
        <Controller
          name={`attendees.${index}`}
          control={control}
          render={({ field: userField, fieldState }) => {
            return (
              <>
                <UsersCombobox
                  value={userField.value}
                  onSelect={(value: User["id"]) => {
                    const selectedUser = userKeys.find((user) => user.id === value);
                    userField.onChange(selectedUser);
                  }}
                  excludeUserIds={userKeys.filter((u) => !u.active).map((u) => u.id)}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </>
            );
          }}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
