import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

type Props = {
  title: string;
  description: string;
  confirmText: string;
  onClose: () => void;
  deleteFn: () => void;
};

export default function DeleteDialog({ title, description, confirmText, onClose, deleteFn }: Props) {
  const [value, setValue] = useState("");
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-muted-foreground">{description}</p>
          <p className="mt-2 text-sm text-destructive">請輸入：{confirmText}</p>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </DialogHeader>
        <DialogFooter>
          <Button onClick={deleteFn} disabled={confirmText !== value}>
            刪除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
