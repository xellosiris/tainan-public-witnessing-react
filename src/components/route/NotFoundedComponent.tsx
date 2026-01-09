import { Link } from "@tanstack/react-router";
import { CircleQuestionMarkIcon } from "lucide-react";

type Props = {};

export default function NotFoundedComponent({}: Props) {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <CircleQuestionMarkIcon />
          <span className="text-xl">此頁面不存在</span>
        </div>
        <Link to={"/"} className="font-semibold underline">
          返回首頁
        </Link>
      </div>
    </div>
  );
}
