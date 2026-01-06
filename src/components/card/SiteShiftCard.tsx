// SiteShiftCard.tsx
import { cn } from "@/lib/utils";
import type { SiteShift } from "@/types/site";
import dayjs from "dayjs";
import { ClockIcon, PenIcon, Trash2Icon, UsersRoundIcon, VanIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

type Props = {
  siteShift: SiteShift;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
};

export default function SiteShiftCard({ siteShift, onEdit, onDelete, onToggleActive }: Props) {
  return (
    <Card className={cn("gap-1 p-2 w-full max-w-sm transition-all", !siteShift.active && "opacity-60 bg-muted/50")}>
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant={siteShift.active ? "default" : "secondary"}>
              {dayjs().day(siteShift.weekday).format("ddd")}
            </Badge>
            {!siteShift.active && (
              <Badge variant="outline" className="text-xs">
                已停用
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} aria-label="編輯班次">
              <PenIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10"
              onClick={onDelete}
              aria-label="刪除班次"
            >
              <Trash2Icon className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-3 py-2">
        <div className="flex gap-2 text-sm text-muted-foreground items-center">
          <ClockIcon className="size-4 shrink-0" />
          <span>
            {siteShift.startTime} ～ {siteShift.endTime}
          </span>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground items-center">
          <UsersRoundIcon className="size-4 shrink-0" />
          <span>人數上限：{siteShift.attendeesLimit} 人</span>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground items-center">
          <VanIcon className="size-4 shrink-0" />
          <span>需要搬運的人數：{siteShift.requiredDeliverers} 人</span>
        </div>
      </CardContent>

      {onToggleActive && (
        <CardFooter className="p-3 pt-2">
          <Button
            className="w-full"
            variant={siteShift.active ? "outline" : "default"}
            size="sm"
            onClick={onToggleActive}
          >
            {siteShift.active ? "停用班次" : "啟用班次"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
