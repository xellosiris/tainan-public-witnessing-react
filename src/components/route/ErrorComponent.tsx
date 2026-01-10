import { AlertCircle } from "lucide-react";

export default function ErrorComponent({
  warningText = "此頁面出現問題，請回報給管理員",
}: {
  warningText?: string;
}) {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex items-center gap-2">
        <AlertCircle />
        <span className="text-xl">{warningText}</span>
      </div>
    </div>
  );
}
