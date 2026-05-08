type SiteFooterProps = {
  businessName: string
  businessHours: string
  logoImage: string
}

export function SiteFooter({ businessName, businessHours, logoImage }: SiteFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-4">
            <img src={logoImage} alt={`${businessName} logo`} className="h-14 w-14 rounded-2xl border border-slate-200 bg-white p-1" />
            <p className="text-xl font-semibold text-slate-950">{businessName}</p>
          </div>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-700">
            Restoration and repair work for homeowners who want clear communication, dependable service, and a simple quote process.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Contact</p>
          <p className="mt-3 text-base leading-7 text-slate-700">Aurora, Colorado</p>
          <p className="mt-3 text-base leading-7 text-slate-700">Service areas: communities within 30 miles</p>
          <p className="mt-3 text-base leading-7 text-slate-700">Business hours: {businessHours}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Navigation</p>
          <nav className="mt-3 flex flex-col gap-3 text-base text-slate-700">
            <a href="#home" className="hover:text-rose-700">
              Home
            </a>
            <a href="#services" className="hover:text-rose-700">
              Services
            </a>
            <a href="#gallery" className="hover:text-rose-700">
              Gallery
            </a>
            <a href="#quote-form" className="hover:text-rose-700">
              Get a Quote
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
