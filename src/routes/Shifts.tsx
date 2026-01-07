import ShiftCard from "@/components/card/ShiftCard";
import ShiftDialog from "@/components/dialog/ShiftDialog";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { SingleDatePicker } from "@/components/ui/singleDatePicker";
import { getShiftsByDate } from "@/services/shifts";
import type { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";

export default function Shifts() {
  const [date, setDate] = useState<string | undefined>(dayjs().format("YYYY-MM-DD"));
  const [editShiftObj, setEditShiftObj] = useState<Shift | null | undefined>(undefined);
  const { data: shifts, isLoading } = useQuery({
    queryKey: ["shifts", date],
    queryFn: () => getShiftsByDate(date!),
    enabled: !!date,
  });
  const onDateChange = (d: string | undefined) => {
    setDate(d);
  };
  const onClose = () => {
    setEditShiftObj(undefined);
  };
  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SingleDatePicker date={date} onDateChange={onDateChange} />
        <Button onClick={() => setEditShiftObj(null)}>新增班次</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {shifts && shifts.map((shift) => <ShiftCard key={shift.id} shift={shift} />)}
      </div>
      {editShiftObj !== undefined && <ShiftDialog editShiftObj={editShiftObj} onClose={onClose} />}
    </div>
  );
}
