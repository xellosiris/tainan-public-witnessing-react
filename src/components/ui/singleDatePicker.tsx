import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { zhTW } from "react-day-picker/locale";

type Props = {
  date?: string;
  onDateChange: (date: string | undefined) => void;
  id?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
};

export function SingleDatePicker({ date, onDateChange, id, "aria-invalid": ariaInvalid, disabled }: Props) {
  const dateObj = date ? dayjs(date).toDate() : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    const dateString = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : undefined;
    onDateChange(dateString);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          data-empty={!date}
          aria-invalid={ariaInvalid}
          className="data-[empty=true]:text-muted-foreground w-63 justify-start text-left font-normal"
          disabled={disabled}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? dayjs(date).format("YYYY-MM-DD") : <span>選擇日期</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" locale={zhTW} selected={dateObj} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
