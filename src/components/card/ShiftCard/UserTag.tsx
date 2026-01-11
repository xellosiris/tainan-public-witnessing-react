import { user } from "@/App";
import { cn } from "@/lib/utils";
import type { Shift } from "@/types/shift";
import type { User, UserKey } from "@/types/user";
import { VanIcon } from "lucide-react";

type Props = {
  index: number;
  userKeys: UserKey[];
  requiredDeliverers: Shift["requiredDeliverers"];
  attendee: User["id"];
};

export default function UserTag({ index, userKeys, attendee, requiredDeliverers }: Props) {
  const { id: userId } = user;
  return (
    <div
      key={attendee}
      className={cn(
        "flex items-center justify-center px-3 text-base rounded-l-full rounded-r-full h-7 min-w-18 gap-1",
        attendee === userId ? "bg-primary text-white" : "bg-secondary"
      )}
    >
      {requiredDeliverers > 0 && index < requiredDeliverers && <VanIcon />}
      {userKeys?.find((user) => user.id === attendee)?.displayName ?? "未知？"}
    </div>
  );
}
