import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { updateSetting } from "@/services/setting";
import { type Setting, settingSchema } from "@/types/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { VList } from "virtua";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { Loading } from "../ui/loading";
import { NumberField } from "./fields/NumberInput";
import { SwitchField } from "./fields/SwitchField";
import { TextField } from "./fields/TextField";

type Props = { editSettingObj: Setting };

export default function SettingForm({ editSettingObj }: Props) {
  const form = useForm<Setting>({
    resolver: zodResolver(settingSchema),
    defaultValues: { ...editSettingObj },
  });

  const mutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => toast.success("設定已更新"),
    onError: (err: any) => {
      toast.error(err?.message || "更新失敗");
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "congs",
  });

  const onSubmit = (data: Setting) => {
    mutation.mutate(data);
  };

  const handleAddCong = () => {
    append({
      id: v4(),
      active: true,
      name: "",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="pb-24">
      {mutation.isPending && <Loading />}

      <div className="space-y-6">
        <FieldSet>
          <FieldLegend>基本設定</FieldLegend>
          <FieldGroup className="space-y-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <TextField name="name" label="名稱" control={form.control} />
              </div>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>排班設定</FieldLegend>
          <FieldGroup className="space-y-2 p-4 bg-white rounded-md shadow-sm">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>自動排班日期</ItemTitle>
                <ItemDescription>每個月幾號自動排班，如果是最後一天請輸入 31</ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex items-center gap-2">
                  <NumberField name="scheduleDayOfMonth" label="" control={form.control} min={1} max={31} />
                  <span className="text-sm text-muted-foreground">號</span>
                </div>
              </ItemActions>
            </Item>

            <Item variant="outline">
              <ItemContent>
                <ItemTitle>參與次數限制</ItemTitle>
                <ItemDescription>自動排班時，每人最多被編排幾次</ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex items-center gap-2">
                  <NumberField name="participationLimit" label="" control={form.control} min={1} />
                  <span className="text-sm text-muted-foreground">次</span>
                </div>
              </ItemActions>
            </Item>

            <Item variant="outline">
              <ItemContent>
                <ItemTitle>預設上限人數</ItemTitle>
                <ItemDescription>每一班次參與的上限人數，0 表示無限制</ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex items-center gap-2">
                  <NumberField name="defaultAttendeesLimit" label="" control={form.control} min={0} />
                  <span className="text-sm text-muted-foreground">位</span>
                </div>
              </ItemActions>
            </Item>

            <Item variant="outline">
              <ItemContent>
                <ItemTitle>預設搬運人數</ItemTitle>
                <ItemDescription>每一班次需要參與搬運的人數</ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex items-center gap-2">
                  <NumberField name="defaultRequiredDeliverers" label="" control={form.control} min={0} />
                  <span className="text-sm text-muted-foreground">位</span>
                </div>
              </ItemActions>
            </Item>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <div className="flex items-center justify-between mb-4">
            <FieldLegend>會眾管理</FieldLegend>
            <Button type="button" onClick={handleAddCong} size="sm" variant="default" className="gap-1.5">
              <Plus className="w-4 h-4" />
              新增會眾
            </Button>
          </div>

          <FieldGroup>
            {fields.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">尚未新增任何會眾</p>
                  <p className="text-sm text-muted-foreground">點擊上方按鈕新增第一個會眾</p>
                </div>
              </div>
            ) : (
              <VList style={{ height: 400 }}>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="group bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 my-1"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <TextField
                          name={`congs.${index}.name`}
                          label=""
                          control={form.control}
                          placeholder="請輸入會眾名稱"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <SwitchField name={`congs.${index}.active`} control={form.control} />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="shrink-0 text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                        <span className="sr-only">刪除</span>
                      </Button>
                    </div>

                    {form.formState.errors.congs?.[index]?.name && (
                      <div className="px-4 pb-3">
                        <p className="text-sm text-destructive">{form.formState.errors.congs[index]?.name?.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </VList>
            )}
          </FieldGroup>
        </FieldSet>
      </div>

      {/* 固定底部儲存按鈕 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-3xl mx-auto">
          <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending || !form.formState.isDirty}>
            {mutation.isPending ? "儲存中..." : "儲存設定"}
          </Button>
        </div>
      </div>
    </form>
  );
}
