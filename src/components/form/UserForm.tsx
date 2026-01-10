import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { CONGS } from "@/assets/mock";
import { PERMISSIONS_OPTIONS } from "@/assets/permission";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { type User, userSchema } from "@/types/user";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { SelectField } from "./fields/SelectField";
import { SwitchField } from "./fields/SwitchField";
import { TextAreaField } from "./fields/TextAreaField";
import { TextField } from "./fields/TextField";

type Props = { editUserObj: User | null };
export default function UserForm({ editUserObj }: Props) {
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
    console.log({ data });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>基本設定</FieldLegend>
        <FieldGroup className="p-4 bg-white gap-3 rounded-md shadow-sm">
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
          <div className="grid grid-cols-3 gap-1.5">
            <TextField
              name="displayName"
              label="顯示名稱"
              control={form.control}
            />
            <TextField name="name" label="姓名" control={form.control} />
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
          <SelectField
            name="congId"
            label="會眾"
            options={CONGS}
            control={form.control}
          />
          <div className="grid grid-cols-2 gap-1.5">
            <TextField
              name="cellphone"
              label="行動電話"
              control={form.control}
            />
            <TextField
              name="telephone"
              label="室內電話"
              control={form.control}
            />
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
          >
            儲存
          </Button>
        </div>
      </div>
    </form>
  );
}
