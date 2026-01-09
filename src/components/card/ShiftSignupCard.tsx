// ShiftSignupCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SiteShift } from "@/types/siteShift";
import { MinusCircle, PlusCircle } from "lucide-react";

type Props = {
  siteShift: SiteShift;
  maxTimes: number;
  onTimesChange: (newTimes: number) => void;
};

export default function ShiftSignupCard({ siteShift, maxTimes, onTimesChange }: Props) {
  const handleIncrement = () => {
    if (maxTimes < 5) {
      onTimesChange(maxTimes + 1);
    }
  };

  const handleDecrement = () => {
    if (maxTimes > 0) {
      onTimesChange(maxTimes - 1);
    }
  };

  return (
    <Card className={cn("gap-1 p-1 w-full max-w-sm transition-all", !siteShift.active && "opacity-60 bg-muted/50")}>
      <CardContent className="flex p-1 gap-2 justify-between">
        <div className="flex items-center gap-3 justify-between w-full">
          <h3 className="flex item-center gap-1.5 text-xl">
            {siteShift.startTime} ～ {siteShift.endTime}{" "}
            {!siteShift.active && <Badge variant={"destructive"}>已暫停</Badge>}
          </h3>
          <div className="flex gap-1 items-center">
            <Button
              onClick={handleDecrement}
              variant="ghost"
              size="icon"
              disabled={maxTimes <= 0}
              type="button"
              className={cn(maxTimes <= 0 && "opacity-30 cursor-not-allowed")}
            >
              <MinusCircle className="size-6" />
            </Button>
            <span className="text-3xl min-w-[2ch] text-center">{maxTimes}</span>
            <Button
              onClick={handleIncrement}
              variant="ghost"
              size="icon"
              disabled={maxTimes >= 5}
              type="button"
              className={cn(maxTimes >= 5 && "opacity-30 cursor-not-allowed")}
            >
              <PlusCircle className="size-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
