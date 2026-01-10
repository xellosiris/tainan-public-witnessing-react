import {
  ClockIcon,
  PenIcon,
  Trash2Icon,
  UsersRoundIcon,
  VanIcon,
} from "lucide-react";
import { WEEKDAY_NAMES } from "@/assets/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SiteShift } from "@/types/siteShift";

type Props = {
  siteShift: SiteShift;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
};

export default function SiteShiftCard({
  siteShift,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  return (
    <Card
      className={cn(
        "gap-1 p-2 w-full max-w-xs transition-all",
        !siteShift.active && "opacity-60 bg-muted/50",
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={siteShift.active ? "default" : "secondary"}>
              {WEEKDAY_NAMES[siteShift.weekday]}
            </Badge>
            {!siteShift.active && (
              <Badge variant="outline" className="text-xs">
                已停用
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={onEdit}
              aria-label="編輯班次"
            >
              <PenIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-destructive/10"
              onClick={onDelete}
              aria-label="刪除班次"
            >
              <Trash2Icon className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col p-3 py-2 gap-2">
        <div className="flex items-center text-sm gap-2 text-muted-foreground">
          <ClockIcon className="size-4 shrink-0" />
          <span>
            {siteShift.startTime} ～ {siteShift.endTime}
          </span>
        </div>
        <div className="flex items-center text-sm gap-2 text-muted-foreground">
          <UsersRoundIcon className="size-4 shrink-0" />
          <span>
            人數上限：
            {siteShift.attendeesLimit !== 0
              ? `${siteShift.attendeesLimit}人`
              : "無限制"}
          </span>
        </div>
        <div className="flex items-center text-sm gap-2 text-muted-foreground">
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
