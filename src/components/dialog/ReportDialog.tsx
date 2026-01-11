import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { reportShift } from "@/services/shift";
import type { Shift } from "@/types/shift";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { NumberField } from "../form/fields/NumberInput";

type Props = {
  shift: Shift;
  onClose: () => void;
};

const formSchema = z.object({
  attendeeCount: z.number(),
});

export default function ReportDialog({ shift, onClose }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: shift.attendeeCount
      ? {
          attendeeCount: shift.attendeeCount,
        }
      : {
          attendeeCount: shift.attendees.length,
        },
  });

  const reportMutation = useMutation({
    mutationFn: ({ attendeeCount }: z.infer<typeof formSchema>) => reportShift(shift.id, attendeeCount),
    onSuccess: () => {
      toast.success("回報人數成功");
    },
    onError: () => toast.error("回報失敗，請重新嘗試"),
    onSettled: () => onClose(),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    reportMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>回報</DialogHeader>
        <DialogDescription>回報該班次的參與情況</DialogDescription>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <NumberField name="attendeeCount" label={"實際參與人數"} control={form.control} />
            <Button type="submit">提交</Button>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogDescription>若提交錯誤，可以重複提交</DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
