import UserForm from "@/components/form/UserForm";
import type { User } from "@/types/user";

export default function Profile() {
  const user: User = {
    note: "2018/1/11加入。",
    firebaseSub: "CzuIxz8hZRX4aQbLgTnTkk4hcBc2",
    telephone: "(06)2028640",
    id: "00cf91ce-f962-4025-837a-7b47453406dc",
    displayName: "葉憶秋",
    cellphone: "0987-754-230",
    lineSub: "U47b60d33acd6b812ea51cf47597ee6e6",
    name: "葉憶秋",
    gender: "female",
    active: true,
    congId: "c096a442-e326-4ead-83e2-4a10e3b5262c",
    permission: 3,
  };
  return (
    <div className="max-w-lg">
      <UserForm editUserObj={user} />
    </div>
  );
}
