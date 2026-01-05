import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { FieldError } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { UserKey } from "@/types/user";
import clsx from "clsx";
import { Check, ChevronsUpDown, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { VList } from "virtua";
import type { ShiftFormType } from "../ShiftForm";

type AttendeeFieldProps = {
  control: Control<ShiftFormType>;
  index: number;
  userKeys?: Array<UserKey>;
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
      className={`flex items-center gap-2 p-1 border rounded-lg bg-background transition-all ${
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
                      className={cn("w-full justify-between", !userField.value?.id && "text-muted-foreground")}
                    >
                      {userField.value?.displayName || "請選擇參與者"}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width]! p-0" align="start">
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
                              onSelect={(value) => {
                                const selectedUser = userKeys.find((user) => user.id === value);
                                userField.onChange(selectedUser);
                                setOpen(false);
                              }}
                            >
                              {user.displayName}
                              <Check
                                className={clsx(
                                  "ml-auto size-4",
                                  userField.value?.id === user.id ? "opacity-100" : "opacity-0"
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
