import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1C2B3A] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Home<span className="text-[#F5A623]">Direct</span>
              </span>
            </div>
            <p className="text-[#8FA3B8] text-sm leading-relaxed max-w-xs">
              Rent without the middleman. Transparent, affordable housing powered by the Stellar blockchain — built for Africa, starting in Nigeria.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs text-[#8FA3B8]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Powered by Stellar Network
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F5A623] mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["Browse Listings","List a Property","How it Works","Pricing","Smart Contracts"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[#8FA3B8] hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F5A623] mb-4">Open Source</h4>
            <ul className="space-y-2.5">
              {["GitHub Repository","Contributing Guide","Report an Issue","Roadmap","License (MIT)"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[#8FA3B8] hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8FA3B8]">
            © {new Date().getFullYear()} HomeDirectProject. Open source under MIT License.
          </p>
          <p className="text-xs text-[#8FA3B8]">
            Launching in Lagos · Abuja · Oyo · Rivers · Anambra
          </p>
        </div>
      </div>
    </footer>
  );
}
