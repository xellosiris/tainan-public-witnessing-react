import { cn } from "@/lib/utils";
import type { Shift } from "@/types/shift";
import clsx from "clsx";
import { Check, ChevronsUpDown, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { VList } from "virtua";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { FieldError } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type AttendeeFieldProps = {
  control: Control<Shift>;
  index: number;
  userKeys?: Array<{ id: string; displayName: string }>;
  watchAttendees: string[];
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
};

export function AttendeeField({
  control,
  index,
  userKeys,
  watchAttendees,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: AttendeeFieldProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-2 p-3 border rounded-lg bg-background transition-all ${
        isDragging ? "opacity-30" : ""
      } cursor-move`}
    >
      <GripVertical className="w-5 h-5 text-muted-foreground shrink-0" />
      <div className="flex-1">
        <Controller
          name={`attendees.${index}`}
          control={control}
          render={({ field: userField, fieldState }) => {
            const [open, setOpen] = useState<boolean>(false);
            return (
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn("w-full justify-between", !userField.value && "text-muted-foreground")}
                    >
                      {userField.value
                        ? userKeys?.find((user) => user.id === userField.value)?.displayName
                        : "請選擇參與者"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0 max-h-64 overflow-y-auto"
                    align="start"
                  >
                    <Command
                      filter={(value, search) => {
                        const displayName = userKeys?.find((user) => user.id === value)?.displayName ?? "未知";
                        if (displayName.includes(search)) return 1;
                        return 0;
                      }}
                    >
                      <CommandInput placeholder="搜尋成員..." />
                      <VList style={{ height: 300 }}>
                        <CommandEmpty>找不到成員</CommandEmpty>
                        <CommandGroup>
                          {userKeys?.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              disabled={watchAttendees.includes(user.id)}
                              onSelect={(value) => {
                                userField.onChange(value);
                                setOpen(false);
                              }}
                            >
                              {user.displayName}
                              <Check
                                className={clsx(
                                  "ml-auto size-4",
                                  userField.value === user.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </VList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </div>
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
