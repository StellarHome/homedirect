"use client";
import Link from "next/link";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";
import { ListingCard } from "./components/listings/ListingCard";
import { MOCK_LISTINGS } from "@/lib/mockData";

const STATS = [
  { value: "0%", label: "Agent commission" },
  { value: "5%", label: "Flat service fee" },
  { value: "5", label: "Nigerian cities" },
  { value: "100%", label: "On-chain leases" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Landlords register",
    body: "Verify your identity and property documents in minutes. Pay a small listing fee — that is your only cost.",
  },
  {
    step: "02",
    title: "Tenants search directly",
    body: "Browse verified listings by city, budget, and bedrooms. Message landlords directly with no middleman.",
  },
  {
    step: "03",
    title: "Sign a smart contract",
    body: "Lease agreement encoded on Stellar blockchain. Tamper-proof, legally referenceable, and instant.",
  },
  {
    step: "04",
    title: "Pay via Stellar escrow",
    body: "Security deposit locked in escrow. Rent paid monthly in NGN or USDC, auto-released on schedule.",
  },
];

export default function HomePage() {
  const featuredListings = MOCK_LISTINGS.filter((l) => l.status === "vacant").slice(0, 3);

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F5132] pt-20 pb-32">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#FAFAF7]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] pulse-amber" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-widest">
              Open-source · Built on Stellar · Launching in Nigeria
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
            Rent a home in Nigeria.
            <br />
            <span className="text-[#F5A623]">No agent. No inflated fees.</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            HomeDirectconnects landlords and tenants directly. One transparent 5%
            fee replaces agent commissions, lawyer fees, and the usual drama.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/listings">
              <Button size="lg" variant="amber">
                Browse available homes
              </Button>
            </Link>
            <Link href="/landlord">
              <Button
                size="lg"
                variant="secondary"
                className="!bg-white/10 !border-white/30 !text-white hover:!bg-white/20"
              >
                List your property
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl py-4 px-3">
                <div className="text-2xl font-bold text-[#F5A623]">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-20">
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(15,81,50,0.14)] p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8FA3B8] mb-1.5">
              Location
            </label>
            <select className="w-full text-sm text-[#1C2B3A] bg-transparent outline-none">
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Oyo (Ibadan)</option>
              <option>Rivers (Port Harcourt)</option>
              <option>Anambra</option>
            </select>
          </div>
          <div className="w-px bg-[#E2E8F0] hidden sm:block" />
          <div className="flex-1">
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8FA3B8] mb-1.5">
              Bedrooms
            </label>
            <select className="w-full text-sm text-[#1C2B3A] bg-transparent outline-none">
              <option>Any</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4+</option>
            </select>
          </div>
          <div className="w-px bg-[#E2E8F0] hidden sm:block" />
          <div className="flex-1">
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8FA3B8] mb-1.5">
              Max monthly rent
            </label>
            <select className="w-full text-sm text-[#1C2B3A] bg-transparent outline-none">
              <option>Any budget</option>
              <option>Under 50,000</option>
              <option>Under 100,000</option>
              <option>Under 200,000</option>
              <option>200,000+</option>
            </select>
          </div>
          <Link href="/listings">
            <Button size="lg" className="h-full w-full sm:w-auto">
              Search
            </Button>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F5A623] mb-2">
            Simple by design
          </p>
          <h2 className="text-3xl font-bold text-[#1C2B3A]">
            How HomeDirectworks
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(15,81,50,0.06)]"
            >
              <div className="text-[10px] font-bold text-[#F5A623] uppercase tracking-widest mb-3">
                {item.step}
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#0F5132] mb-4 text-lg font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-[#1C2B3A] text-sm mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-[#8FA3B8] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F5A623] mb-1">
              Available now
            </p>
            <h2 className="text-2xl font-bold text-[#1C2B3A]">
              Vacant homes, verified landlords
            </h2>
          </div>
          <Link
            href="/listings"
            className="text-sm font-medium text-[#0F5132] hover:underline hidden sm:block"
          >
            View all listings
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* OPEN SOURCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#1C2B3A] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Badge variant="stellar" className="mb-4">
              Open Source Project
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-3">
              Built in public. Contributions welcome.
            </h2>
            <p className="text-[#8FA3B8] max-w-md text-sm leading-relaxed">
              HomeDirectis MIT-licensed and maintained openly on GitHub. Whether
              you write Rust smart contracts, TypeScript frontends, or just want to
              file issues — you belong here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="https://github.com/homedirect-africa/homedirect"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="lg"
                className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20 gap-2"
              >
                View on GitHub
              </Button>
            </a>
            <a
              href="https://github.com/homedirect-africa/homedirect/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="amber" size="lg">
                Contribute
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
