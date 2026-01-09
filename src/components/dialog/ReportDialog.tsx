import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import type { Shift } from "@/types/shift";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    defaultValues: !!shift.attendeeCount
      ? {
          attendeeCount: shift.attendeeCount,
        }
      : {
          attendeeCount: shift.attendees.length,
        },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log({ data });
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
