import Link from "next/link";
import { Badge } from "../ui/Badge";

export interface Listing {
  id: string;
  title: string;
  location: string;
  lga: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  type: "apartment" | "duplex" | "bungalow" | "self-contain" | "studio";
  imageUrl: string;
  landlordVerified: boolean;
  status: "vacant" | "occupied" | "pending";
  amenities: string[];
  onChain: boolean;
}

const FMT = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export function ListingCard({ listing }: { listing: Listing }) {
  const serviceFee = Math.round(listing.monthlyRent * 12 * 0.05);

  return (
    <article className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(15,81,50,0.08)] card-lift">
      {/* Image */}
      <Link href={`/listings/${listing.id}`} className="block relative">
        <div className="h-40 sm:h-48 bg-gradient-to-br from-[#0F5132]/10 to-[#157347]/20 relative overflow-hidden">
          {/* Placeholder image gradient */}
          <div className="absolute inset-0 flex items-center justify-center text-[#0F5132]/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          {/* In production: <Image src={listing.imageUrl} fill alt={listing.title} className="object-cover" /> */}
        </div>

        {/* Status badge top-right */}
        <div className="absolute top-3 right-3">
          <Badge variant={listing.status} dot>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </Badge>
        </div>

        {/* Verified badge top-left */}
        {listing.landlordVerified && (
          <div className="absolute top-3 left-3">
            <Badge variant="verified">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified
            </Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#1C2B3A] text-sm leading-snug line-clamp-1">
            {listing.title}
          </h3>
          {listing.onChain && (
            <span className="flex-shrink-0 stellar-badge text-[8px] sm:text-[9px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full text-white">
              On-chain
            </span>
          )}
        </div>

        <p className="text-xs text-[#8FA3B8] mb-3 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {listing.lga}, {listing.state}
        </p>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-[#3D5166] mb-4">
          <span className="flex items-center gap-1">
            <BedIcon /> {listing.bedrooms} bed
          </span>
          <span className="text-[#E2E8F0]">·</span>
          <span className="flex items-center gap-1">
            <BathIcon /> {listing.bathrooms} bath
          </span>
          <span className="text-[#E2E8F0]">·</span>
          <span className="capitalize">{listing.type}</span>
        </div>

        {/* Transparency strip (mini) */}
        <div className="bg-[#0F5132] rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-white mb-3">
          <div className="flex justify-between text-[10px] sm:text-xs mb-1">
            <span className="text-white/70">Annual rent</span>
            <span className="font-medium text-[11px] sm:text-xs">{FMT(listing.monthlyRent * 12)}</span>
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs mb-1.5 sm:mb-2">
            <span className="text-white/70">HomeDirect fee (5%)</span>
            <span className="font-medium text-[#F5A623] text-[11px] sm:text-xs">{FMT(serviceFee)}</span>
          </div>
          <div className="border-t border-white/20 pt-1.5 sm:pt-2 flex justify-between items-center">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#F5A623]">You pay</span>
            <span className="font-bold text-xs sm:text-sm">{FMT(listing.monthlyRent * 12 + serviceFee)}</span>
          </div>
        </div>

        <Link
          href={`/listings/${listing.id}`}
          className="block w-full text-center bg-[#0F5132] hover:bg-[#157347] text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors"
        >
          View Property →
        </Link>
      </div>
    </article>
  );
}

const BedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16M2 8h20v12M2 12h20" />
    <rect x="6" y="4" width="5" height="4" rx="1" />
  </svg>
);

const BathIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" />
    <path d="M6 12V6a2 2 0 012-2h0a2 2 0 012 2v2" />
  </svg>
);
