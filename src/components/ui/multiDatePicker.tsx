import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { zhTW } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  dates?: string[];
  onDatesChange: (dates: string[]) => void;
  id?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
};

export function MultiDatePicker({
  dates = [],
  onDatesChange,
  id,
  "aria-invalid": ariaInvalid,
  disabled,
}: Props) {
  const dateObjs = dates.map((date) => dayjs(date).toDate());

  const handleSelect = (selectedDates: Date[] | undefined) => {
    const dateStrings = selectedDates
      ? selectedDates.map((date) => dayjs(date).format("YYYY-MM-DD"))
      : [];
    onDatesChange(dateStrings);
  };

  const displayText = () => {
    if (dates.length === 0) {
      return <span>選擇日期</span>;
    }
    if (dates.length === 1) {
      return dayjs(dates[0]).format("YYYY-MM-DD");
    }
    return `已選擇 ${dates.length} 個日期`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          data-empty={dates.length === 0}
          aria-invalid={ariaInvalid}
          className="data-[empty=true]:text-muted-foreground w-63 justify-start text-left font-normal"
          disabled={disabled}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {displayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="multiple"
          locale={zhTW}
          selected={dateObjs}
          onSelect={handleSelect}
          classNames={{
            root: "shrink-0 w-full max-w-xs border rounded-md",
            day: "h-10 w-10 p-0 mx-auto",
            row: "mt-1",
            day_button: "rounded-full",
            caption_label: "text-xl",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
