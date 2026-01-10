import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSetting } from "@/services/setting";
import type { Shift } from "@/types/shift";
import ShiftForm from "../form/ShiftForm";

type Props = {
  editShiftObj: Shift | null;
  onClose: () => void;
};

export default function ShiftDialog({ editShiftObj, onClose }: Props) {
  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  const { userKeys, siteKeys } = setting;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editShiftObj ? "編輯" : "新增"}班次</DialogTitle>
          <DialogDescription>班次的設定與參與人員</DialogDescription>
        </DialogHeader>
        <ShiftForm
          editShiftObj={editShiftObj}
          siteKeys={siteKeys}
          userKeys={userKeys}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
