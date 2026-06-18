"use client";

interface TransparencyStripProps {
  monthlyRent: number;
  serviceFeePercent?: number;
  currency?: string;
}

export function TransparencyStrip({
  monthlyRent,
  serviceFeePercent = 5,
  currency = "₦",
}: TransparencyStripProps) {
  const annualRent = monthlyRent * 12;
  const serviceFee = Math.round(annualRent * (serviceFeePercent / 100));
  const totalFirstYear = annualRent + serviceFee;

  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-NG")}`;

  return (
    <div className="transparency-strip rounded-xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#F5A623]">
          Full Cost Breakdown
        </span>
      </div>

      <div className="space-y-2">
        <Row label="Monthly rent" value={fmt(monthlyRent)} sub />
        <Row label="Annual rent (×12)" value={fmt(annualRent)} />
        <Row
          label={`HomeDirectfee (${serviceFeePercent}%)`}
          value={fmt(serviceFee)}
          note="replaces agent + lawyer fees"
        />
        <div className="border-t border-white/20 pt-2 mt-1">
          <Row label="Total first-year cost" value={fmt(totalFirstYear)} highlight />
        </div>
      </div>

      <p className="text-[10px] text-white/50 mt-3 leading-relaxed">
        No hidden charges. No agent commission. No renewal fees. What you see is what you pay.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  note,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  sub?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="transparency-strip-row">
      <div>
        <span className={clsx("text-sm", sub ? "text-white/60" : "text-white/90")}>
          {label}
        </span>
        {note && (
          <span className="ml-2 text-[10px] text-[#F5A623]/80 italic">{note}</span>
        )}
      </div>
      <span
        className={clsx(
          "font-semibold text-sm",
          highlight ? "text-[#F5A623] text-base" : "text-white"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
