"use client";
import { useState } from "react";
import { ListingCard } from "../components/listings/ListingCard";
import { MOCK_LISTINGS, STATES, BEDROOMS } from "@/lib/mockData";

export default function ListingsPage() {
  const [state, setState] = useState("All States");
  const [beds, setBeds] = useState("Any");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOnChain, setOnlyOnChain] = useState(false);

  const filtered = MOCK_LISTINGS.filter((l) => {
    if (state !== "All States" && l.state !== state) return false;
    if (beds !== "Any") {
      const n = parseInt(beds);
      if (beds === "4+" ? l.bedrooms < 4 : l.bedrooms !== n) return false;
    }
    if (onlyVerified && !l.landlordVerified) return false;
    if (onlyOnChain && !l.onChain) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-[#0F5132] pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#F5A623] text-xs font-semibold uppercase tracking-widest mb-2">
            {filtered.length} properties available
          </p>
          <h1 className="text-3xl font-bold text-white">Browse verified listings</h1>
          <p className="text-white/60 mt-2 text-sm">
            Every listing connects you directly to the landlord. No agent in the chain.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(15,81,50,0.10)] p-4 mb-8 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8FA3B8] mb-1">State</label>
            <select
              className="text-sm text-[#1C2B3A] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8FA3B8] mb-1">Bedrooms</label>
            <select
              className="text-sm text-[#1C2B3A] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
            >
              {BEDROOMS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <label className="flex items-center gap-2 text-sm text-[#3D5166] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="accent-[#0F5132] w-4 h-4"
              />
              Verified landlords only
            </label>
            <label className="flex items-center gap-2 text-sm text-[#3D5166] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOnChain}
                onChange={(e) => setOnlyOnChain(e.target.checked)}
                className="accent-[#0F5132] w-4 h-4"
              />
              On-chain lease only
            </label>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#8FA3B8]">
            <div className="text-5xl mb-4">🏠</div>
            <p className="font-medium text-[#1C2B3A]">No properties match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
