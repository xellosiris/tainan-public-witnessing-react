import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { FieldError } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ShiftForm } from "@/types/shift";
import type { UserKey } from "@/types/user";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Check, ChevronsUpDown, GripVertical, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { VList } from "virtua";

type AttendeeFieldProps = {
  control: Control<ShiftForm>;
  index: number;
  id: string; // 用於 dnd-kit
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
            const [open, setOpen] = useState<boolean>(false);
            const [query, setQuery] = useState<string>("");
            const filterUsers = useMemo<UserKey[]>(() => {
              if (!!query) {
                return userKeys.filter((user) => user.displayName.includes(query));
              }
              return [];
            }, [query, userKeys]);
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
                      {userField.value?.displayName || "請選擇人員"}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width]! p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput value={query} onValueChange={setQuery} placeholder="搜尋成員..." />
                      {!!query && (
                        <VList style={{ height: 180 }}>
                          <CommandEmpty>找不到成員</CommandEmpty>
                          <CommandGroup>
                            {filterUsers?.map((user) => (
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
                      )}
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
