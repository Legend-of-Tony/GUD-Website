type SiteHeaderProps = {
  businessName: string
  isPastHero: boolean
  logoImage: string
}

export function SiteHeader({ businessName, isPastHero, logoImage }: SiteHeaderProps) {
  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300 sm:h-24 ${
        isPastHero ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-4">
          <a href="#home" className="pointer-events-auto flex min-w-0 items-center">
            <img src={logoImage} alt={`${businessName} logo`} className="h-12 w-auto shrink-0 rounded-2xl bg-white p-1.5 sm:h-16" />
          </a>

          <div className="pointer-events-auto flex items-center gap-3 sm:gap-4 lg:gap-6">
            <nav className="hidden items-center gap-x-5 text-base font-semibold text-white md:flex">
              <a className="transition-colors hover:text-rose-100" href="#home">
                Home
              </a>
              <a className="transition-colors hover:text-rose-100" href="#services">
                Services
              </a>
              <a className="transition-colors hover:text-rose-100" href="#gallery">
                Gallery
              </a>
              <a className="transition-colors hover:text-rose-100" href="#contact">
                Contact
              </a>
            </nav>

            <a
              href="#quote-form"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-rose-700 px-4 py-2.5 text-sm font-semibold !text-white shadow-lg shadow-rose-900/25 transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:py-3 sm:text-base"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
