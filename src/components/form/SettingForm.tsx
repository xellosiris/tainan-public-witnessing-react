import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { updateSetting } from "@/services/setting";
import { settingSchema, type Setting } from "@/types/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { Loading } from "../ui/loading";
import { NumberField } from "./fields/NumberInput";
import { TextField } from "./fields/TextField";

type Props = { editSettingObj: Setting };

export default function SettingForm({ editSettingObj }: Props) {
  const form = useForm<Setting>({
    resolver: zodResolver(settingSchema),
    defaultValues: { ...editSettingObj },
  });

  const mutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: (data) => {
      toast.success("設定已更新");
      console.log("Updated setting:", data);
    },
    onError: (err: any) => {
      toast.error(err?.message || "更新失敗");
    },
  });

  const onSubmit = (data: Setting) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {mutation.isPending && <Loading />}
      <FieldSet>
        <FieldLegend>系統設定</FieldLegend>
        <FieldGroup className="p-4 bg-white rounded-md shadow-sm">
          <TextField name="name" label="名稱" control={form.control} />

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>自動排班日期</ItemTitle>
              <ItemDescription>每個月幾號自動排班，如果是最後一天請輸入31</ItemDescription>
            </ItemContent>
            <ItemActions>
              <NumberField name="scheduleDayOfMonth" label="" control={form.control} />號
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>參與次數</ItemTitle>
              <ItemDescription>自動排班時，每人最多被編排幾次</ItemDescription>
            </ItemContent>
            <ItemActions>
              <NumberField name="participationLimit" label="" control={form.control} />次
            </ItemActions>
          </Item>
        </FieldGroup>
      </FieldSet>

      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-sm mx-auto">
          <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
            儲存
          </Button>
        </div>
      </div>
    </form>
  );
}
