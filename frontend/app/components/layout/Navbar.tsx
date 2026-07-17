"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0F5132] flex items-center justify-center group-hover:bg-[#157347] transition-colors">
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-bold text-base sm:text-lg text-[#0F5132] tracking-tight">
              Home<span className="text-[#F5A623]">Direct</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6">
            <Link href="/listings" className="nav-link text-xs sm:text-sm text-[#3D5166] hover:text-[#0F5132] font-medium transition-colors">
              Browse Homes
            </Link>
            <Link href="/landlord" className="nav-link text-xs sm:text-sm text-[#3D5166] hover:text-[#0F5132] font-medium transition-colors">
              List Property
            </Link>
            <Link href="/about" className="nav-link text-xs sm:text-sm text-[#3D5166] hover:text-[#0F5132] font-medium transition-colors">
              How it Works
            </Link>
            <div className="w-px h-4 sm:h-5 bg-[#E2E8F0]" />
            <StellarBadge />
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="primary" size="sm">Get started</Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-[#3D5166] hover:bg-[#0F5132]/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path d="M6 18L18 6M6 6l12 12" />
                : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
          <MobileLink href="/listings" label="Browse Homes" />
          <MobileLink href="/landlord" label="List Property" />
          <MobileLink href="/about" label="How it Works" />
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="secondary" fullWidth>Sign in</Button>
            <Button variant="primary" fullWidth>Get started</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block text-sm font-medium text-[#3D5166] hover:text-[#0F5132] py-2">
      {label}
    </Link>
  );
}

function StellarBadge() {
  return (
    <div className="stellar-badge flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-widest">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#F5A623">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#F5A623" strokeWidth="2" fill="none" />
      </svg>
      Stellar
    </div>
  );
}
