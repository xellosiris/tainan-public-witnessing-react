import { siteSchema, type Site } from "@/types/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { SwitchField } from "../form/fields/SwitchField";
import { TextAreaField } from "../form/fields/TextAreaField";
import { TextField } from "../form/fields/TextField";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { FieldGroup } from "../ui/field";

type Props = {
  onClose: () => void;
};

export default function SiteDialog({ onClose }: Props) {
  const form = useForm<Site>({
    resolver: zodResolver(siteSchema),
    defaultValues: { id: v4(), active: true, name: "", description: "", siteShifts: [] },
  });
  const onSubmit = (data: Site) => {
    console.log({ data });
    onClose();
  };
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增地點</DialogTitle>
          <DialogDescription>新增擺放地點及細節描述</DialogDescription>
        </DialogHeader>
        <form>
          <FieldGroup>
            <SwitchField name="active" label="啟用" control={form.control} />
            <TextField name="name" label="地點名稱" control={form.control} />
            <TextAreaField name="description" label="地點描述" control={form.control} />
          </FieldGroup>
        </form>
        <DialogFooter className="gap-2">
          <Button onClick={onClose} variant={"secondary"}>
            取消
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
