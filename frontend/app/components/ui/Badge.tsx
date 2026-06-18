import { clsx } from "clsx";

type BadgeVariant = "verified" | "vacant" | "occupied" | "pending" | "stellar" | "default";

const badgeStyles: Record<BadgeVariant, string> = {
  verified: "bg-[#F5A623]/15 text-[#92400E] border border-[#F5A623]/40",
  vacant: "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]",
  occupied: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]",
  pending: "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]",
  stellar:
    "bg-[#0F5132] text-white border border-[#F5A623]/40",
  default: "bg-[#F1F5F9] text-[#3D5166] border border-[#E2E8F0]",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "vacant" && "bg-[#16A34A]",
            variant === "occupied" && "bg-[#DC2626]",
            variant === "pending" && "bg-[#D97706]",
            variant === "verified" && "bg-[#F5A623]",
          )}
        />
      )}
      {children}
    </span>
  );
}
