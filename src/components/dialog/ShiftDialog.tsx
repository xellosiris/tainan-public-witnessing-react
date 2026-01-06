import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSiteKeys } from "@/services/sites";
import { getUserKeys } from "@/services/users";
import { type Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";
import ShiftForm from "../form/ShiftForm";
import { Loading } from "../ui/loading";

type Props = {
  editShiftObj: Shift | null;
  onClose: () => void;
};

export default function ShiftDialog({ editShiftObj, onClose }: Props) {
  const { data: sites, isLoading: siteLoading } = useQuery({
    queryKey: ["siteKeys"],
    queryFn: getSiteKeys,
  });
  const { data: userKeys, isLoading: userKeysLoading } = useQuery({
    queryKey: ["userKeys"],
    queryFn: getUserKeys,
  });

  if (siteLoading || userKeysLoading) return <Loading />;
  if (!sites || !userKeys) return <div>地點和使用者不存在</div>;

  return (
    <Dialog open onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editShiftObj ? "編輯" : "新增"}班次</DialogTitle>
          <DialogDescription>班次的設定與參與人員</DialogDescription>
        </DialogHeader>
        <ShiftForm editShiftObj={editShiftObj} sites={sites} userKeys={userKeys} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
