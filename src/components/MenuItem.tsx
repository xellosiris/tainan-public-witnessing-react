import { Link } from "@tanstack/react-router";

type Props = {
  url: string;
  label: string;
  onClick: () => void;
};

export default function MenuItem({ url, label, onClick }: Props) {
  return (
    <Link to={url} className="ml-4 transition-colors hover:text-primar" onClick={onClick}>
      {label}
    </Link>
  );
}
