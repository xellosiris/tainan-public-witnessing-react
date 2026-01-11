import { PERMISSIONS_OPTIONS } from "@/assets/permission";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { createUser, updateUser } from "@/services/user";
import type { Cong } from "@/types/congregation";
import { type User, userSchema } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { Loading } from "../ui/loading";
import { SelectField } from "./fields/SelectField";
import { SwitchField } from "./fields/SwitchField";
import { TextAreaField } from "./fields/TextAreaField";
import { TextField } from "./fields/TextField";

type Props = { editUserObj: User | null; congs: Cong[] };
export default function UserForm({ editUserObj, congs }: Props) {
  const queryClient = useQueryClient();
  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: editUserObj
      ? { ...editUserObj }
      : {
          id: v4(),
          active: true,
          name: "",
          displayName: "",
          gender: "male",
          congId: "",
          permission: 3,
          cellphone: "",
          bindCode: "",
        },
  });
  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: (user: User) => (editUserObj ? updateUser(user) : createUser(user)),
    onSuccess: (_, user) => {
      toast.success(editUserObj ? `更新成功` : `新增成功`, {
        description: `${user.displayName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["setting"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: () => toast.error(editUserObj ? "更新失敗" : "新增失敗"),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {mutation.isPending && <Loading />}
      <FieldSet>
        <FieldLegend>基本設定</FieldLegend>
        <FieldGroup className="gap-3 p-4 bg-white rounded-md shadow-sm">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>人員啟用</ItemTitle>
              <ItemDescription>
                啟用後，使用者可以開始使用系統。
                <br />
                關閉後，使用者無法進入系統。若關閉達1年以上會自動刪除該成員資料
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <SwitchField name="active" label="啟用" control={form.control} />
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>系統顯示名稱</ItemTitle>
              <ItemDescription>為了避免撞名，這是系統上顯示你的名字。若需要修改請聯繫管理員</ItemDescription>
            </ItemContent>
            <ItemActions>
              <TextField name="displayName" label="名稱" control={form.control} />
            </ItemActions>
          </Item>

          <div className="grid grid-cols-2 gap-1.5">
            <TextField name="name" label="實際姓名" control={form.control} />
            <SelectField
              name="gender"
              label="性別"
              options={[
                { id: "male", name: "男性" },
                { id: "female", name: "女性" },
              ]}
              control={form.control}
            />
          </div>
          <SelectField name="congId" label="會眾" options={congs} control={form.control} />
          <div className="grid grid-cols-2 gap-1.5">
            <TextField name="cellphone" label="行動電話" control={form.control} />
            <TextField name="telephone" label="室內電話" control={form.control} />
          </div>
          <SelectField
            name="permission"
            label="權限"
            options={PERMISSIONS_OPTIONS}
            control={form.control}
            valueAsNumber
          />
          <TextAreaField name="note" label="備註" control={form.control} />
        </FieldGroup>
      </FieldSet>
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-sm mx-auto">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            size="lg"
            disabled={mutation.isPending || !form.formState.isDirty}
          >
            儲存
          </Button>
        </div>
      </div>
    </form>
  );
}
