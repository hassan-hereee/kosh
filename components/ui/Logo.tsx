import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="PriorityPlus Financial"
      width={163}
      height={53}
      className={cn("h-[53px] w-[163px]", className)}
    />
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt=""
      aria-hidden
      width={163}
      height={53}
      className={cn("h-[53px] w-[163px]", className)}
    />
  );
}
