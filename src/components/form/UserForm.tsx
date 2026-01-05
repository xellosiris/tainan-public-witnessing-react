import { PERMISSIONS_OPTIONS } from "@/assets/permission";
import { userSchema, type User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { Button } from "../ui/button";
import { FieldGroup, FieldSet } from "../ui/field";
import { SelectField } from "./fields/SelectField";
import { SwitchField } from "./fields/SwitchField";
import { TextAreaField } from "./fields/TextAreaField";
import { TextField } from "./fields/TextField";
type Props = { editUserObj: User | null };

export default function UserForm({ editUserObj }: Props) {
  const congs = [
    { active: true, id: "03f6ab6a-650b-4219-b412-3e55af675322", name: "第九分區" },
    { active: false, id: "04762562-8fa1-48aa-83ed-00ffc55555cd", name: "暫停使用" },
    { id: "04b4c3c4-9587-4d61-9f2d-60d1f41bb72f", active: true, name: "歸仁區閩南語" },
    { active: true, id: "05377166-4f94-4afc-b9d3-8c67c5488f56", name: "麻豆區麻豆" },
    { active: true, id: "0e9c71fd-98d3-4e88-86c0-bb2ca83b7745", name: "閩南語分區" },
    { id: "12518def-8e75-4f67-ae78-d0f130c77ef4", active: true, name: "安平區安平" },
    { active: true, id: "191727c6-9956-42f5-903e-c23e30354cc1", name: "東區東區" },
    { active: true, id: "1c274cd6-3652-4691-a200-1bcc3ff9b618", name: "歸仁區歸仁" },
    { active: true, id: "30a00733-5edd-4d66-aafa-283c048ae870", name: "安南區安南" },
    { id: "4230a849-5f2c-4f48-961e-7901a2e11823", active: true, name: "仁德區仁德" },
    { id: "44391970-9f67-44bc-bfe8-c4fabfb8024c", active: true, name: "新化區新化" },
    { active: true, id: "4510f7b8-72f7-4cc4-a464-34dced0292a4", name: "第七分區" },
    { active: true, id: "5a17573a-d2be-4051-aad9-7c7e1e1e8c5b", name: "岡山區岡山" },
    { active: true, id: "5bb08fdb-0068-4a59-9851-9de85d017b0e", name: "新營區閩南語" },
    { active: true, id: "5f4c0399-46f8-4746-bb84-e05a0a3be102", name: "東區手語" },
    { active: true, id: "72af74f6-b773-4905-b6ab-b4c9aa716fbe", name: "新營區新營" },
    { active: true, id: "8229376f-2c5e-4def-bf29-16b244b3dbae", name: "南區南區" },
    { id: "9e99a785-1c0e-44dd-bdb5-1f343d4cf085", active: true, name: "西港區西港" },
    { active: true, id: "9eebfd05-273b-4279-9375-3e94af0046cc", name: "北區他加祿語" },
    { id: "a9489796-d94f-4dc2-889f-83c9d0990f4d", active: true, name: "路竹區路竹" },
    { active: true, id: "c096a442-e326-4ead-83e2-4a10e3b5262c", name: "北區北區" },
    { id: "cc15167a-7492-4169-9685-fcc1e2ae7d77", active: true, name: "永康區永康" },
    { active: true, id: "d5496257-3233-4d6c-a07b-34adb2f7c567", name: "東區閩南語" },
    { id: "d9f8364b-bade-486a-8d99-5c374aa1cc68", active: true, name: "佳里區佳里" },
    { active: true, id: "ddcb36a3-2436-4bf3-a249-8d9519e047fe", name: "路竹區閩南語" },
    { active: true, id: "ef83f974-fd7e-4e2d-ac64-1e0e21f0186b", name: "北區印尼語" },
  ];
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
        },
  });
  const onSubmit = (data: User) => {
    console.log({ data });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="gap-3">
          <SwitchField name="active" label="啟用人員" control={form.control} />
          <div className="grid grid-cols-3 gap-1.5">
            <TextField name="displayName" label="顯示名稱" control={form.control} />
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
          <SelectField name="congId" label="會眾" options={congs} control={form.control} />
          <SelectField
            name="permission"
            label="權限"
            options={PERMISSIONS_OPTIONS}
            control={form.control}
            valueAsNumber
          />
          <TextField name="cellphone" label="行動電話" control={form.control} />
          <TextField name="telephone" label="室內電話" control={form.control} />
          <TextAreaField name="note" label="備註" control={form.control} />
        </FieldGroup>
      </FieldSet>
      <Button type="submit" className="mt-5 ">
        提交
      </Button>
    </form>
  );
}
