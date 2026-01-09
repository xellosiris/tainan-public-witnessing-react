import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types/schedule";
import type { SiteKey } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import { MinusCircle, Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import ShiftGroupedView from "../form/ShiftGroupedView";

type Props = {
  siteShifts: SiteShift[];
  siteKeys: SiteKey[];
  currentLimits: Schedule["siteShiftLimits"];
  onUpdateLimits: (newLimits: Schedule["siteShiftLimits"]) => void;
};

export default function SignupShiftDialog({ siteShifts, siteKeys, currentLimits, onUpdateLimits }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLimits, setTempLimits] = useState<Record<string, number>>({});

  // 當 Dialog 打開時,初始化 tempLimits
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempLimits({ ...currentLimits });
    }
  };

  const updateShiftTimes = (siteShiftId: string, newTimes: number) => {
    const clampedTimes = Math.max(0, Math.min(5, newTimes));

    if (clampedTimes === 0) {
      const { [siteShiftId]: _, ...rest } = tempLimits;
      setTempLimits(rest);
    } else {
      setTempLimits({
        ...tempLimits,
        [siteShiftId]: clampedTimes,
      });
    }
  };

  const handleSave = () => {
    onUpdateLimits(tempLimits);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempLimits({ ...currentLimits });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" />
          報名（修改）
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>編輯班次報名</DialogTitle>
          <DialogDescription>調整每個班次的參與次數 (0-5 次),次數為 0 將自動移除</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <ShiftGroupedView
            siteShifts={siteShifts}
            siteKeys={siteKeys}
            renderShift={(siteShift) => {
              const currentTimes = tempLimits[siteShift.id] || 0;
              return (
                <div
                  className={cn(
                    "flex items-center justify-between p-3 bg-white border rounded-lg transition-all",
                    currentTimes > 0 ? "border-primary bg-primary/5" : "border-gray-200",
                    !siteShift.active && "opacity-60"
                  )}
                >
                  <div className="flex-1">
                    <h5 className="text-lg font-medium">
                      {siteShift.startTime} ～ {siteShift.endTime}
                    </h5>
                    {!siteShift.active && <Badge variant={"secondary"}>停用中</Badge>}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      onClick={() => updateShiftTimes(siteShift.id, currentTimes - 1)}
                      variant="ghost"
                      size="icon"
                      disabled={currentTimes <= 0 || !siteShift.active}
                      className={cn(currentTimes <= 0 && "opacity-30")}
                    >
                      <MinusCircle className="size-8" />
                    </Button>
                    <span className="text-3xl min-w-[2ch] text-center font-semibold">{currentTimes}</span>
                    <Button
                      type="button"
                      onClick={() => updateShiftTimes(siteShift.id, currentTimes + 1)}
                      variant="ghost"
                      size="icon"
                      disabled={currentTimes >= 5 || !siteShift.active}
                      className={cn(currentTimes >= 5 && "opacity-30")}
                    >
                      <PlusCircle className="size-8" />
                    </Button>
                  </div>
                </div>
              );
            }}
            emptyState={
              <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                <p>此地點尚無可報名的班次</p>
              </div>
            }
          />
        </div>

        <div className="flex justify-end pt-4 border-t gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button type="button" onClick={handleSave}>
            確認儲存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
