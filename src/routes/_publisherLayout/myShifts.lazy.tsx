import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { zhTW } from "react-day-picker/locale";
import ShiftCard from "@/components/card/ShiftCard";
import { Calendar } from "@/components/ui/calendar";
import { getPersonalShiftByMonth } from "@/services/shift";
import type { User } from "@/types/user";

export const Route = createLazyFileRoute("/_publisherLayout/myShifts")({
  component: () => PersonalShifts("00cf91ce-f962-4025-837a-7b47453406dc"),
});

function PersonalShifts(id: User["id"]) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [month, setMonth] = useState<Date>(new Date());

  const yearMonth = dayjs(month).format("YYYY-MM");

  const { data: shifts } = useSuspenseQuery({
    queryKey: ["shifts", id, yearMonth],
    queryFn: () => getPersonalShiftByMonth(id, yearMonth),
  });

  const shiftDates = shifts?.map((shift) => dayjs(shift.date).toDate()) || [];

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    setSelectedDate(undefined); // 切換月份時清除選擇
  };

  const filteredShifts = useMemo(() => {
    if (selectedDate) {
      return shifts?.filter(
        (shift) => shift.date === dayjs(selectedDate).format("YYYY-MM-DD"),
      );
    }
    return null;
  }, [selectedDate, shifts]);
  return (
    <div className="flex flex-col">
      <Calendar
        mode="single"
        locale={zhTW}
        month={month}
        onMonthChange={handleMonthChange}
        selected={selectedDate}
        onSelect={handleSelect}
        modifiers={{
          hasShift: shiftDates,
          selected: selectedDate,
        }}
        modifiersClassNames={{
          hasShift: "bg-primary/10 font-semibold rounded-full",
        }}
        classNames={{
          root: "shrink-0 w-full max-w-xs border rounded-md",
          day: "h-10 w-10 p-0 mx-auto",
          row: "mt-1",
          day_button: "rounded-full",
          caption_label: "text-xl",
        }}
      />

      <div className="mt-8 space-y-2">
        <h3 className="text-lg font-semibold">
          {selectedDate
            ? `${dayjs(selectedDate).format("MM月DD日")} 的班表`
            : "請選擇日期"}
          {filteredShifts &&
            filteredShifts.length > 0 &&
            ` (當天有${filteredShifts.length}個班次)`}
        </h3>
        <div className="flex flex-wrap gap-4">
          {!!filteredShifts &&
            filteredShifts?.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))}
          {filteredShifts?.length === 0 && (
            <p className="text-muted-foreground">當天無班表</p>
          )}
          {!filteredShifts && !selectedDate && (
            <p className="text-muted-foreground">請選擇日期以查看班表</p>
          )}
        </div>
      </div>
    </div>
  );
}
