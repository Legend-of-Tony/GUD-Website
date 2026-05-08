type HeroSectionProps = {
  featuredImage: string
  heroBadge: string
  heroDescription: string
}

export function HeroSection({ featuredImage, heroBadge, heroDescription }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 sm:h-[100svh] sm:max-h-[100svh] sm:pt-24"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.68) 0%, rgba(15, 23, 42, 0.48) 36%, rgba(15, 23, 42, 0.3) 62%, rgba(15, 23, 42, 0.52) 100%), url(${featuredImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 pt-8 sm:h-full sm:max-h-[100svh] sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8 lg:pb-24">
        <div className="relative reveal self-start pt-2 sm:pt-4">
          <h1 className="max-w-4xl text-balance text-[4.5rem] font-semibold tracking-tight text-rose-700 sm:text-8xl lg:text-[8rem] xl:text-[10rem]">
            GUD
          </h1>
          <h2 className="mt-2 max-w-3xl text-balance text-xl font-semibold tracking-tight text-white sm:mt-3 sm:text-3xl lg:text-4xl">
            Restoration and Repair LLC
          </h2>
        </div>

        <div className="relative reveal lg:justify-self-end lg:self-center" style={{ animationDelay: '120ms' }}>
          <div className="rounded-[2rem] border border-white/35 bg-black/30 p-4 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.75)] backdrop-blur-md sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">{heroBadge}</p>
            <p className="mt-4 text-base leading-7 text-white sm:mt-5 sm:text-xl sm:leading-8">{heroDescription}</p>
            <div className="mt-6 sm:mt-8">
              <a
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-rose-900/25 transition hover:bg-rose-800 sm:px-6 sm:py-4 sm:text-base"
              >
                Get a Free Quote
              </a>
            </div>

            <dl className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-3xl border border-white/30 bg-black/30 p-4 backdrop-blur-sm sm:p-5">
                <dt className="text-sm font-medium text-white/80">Response time</dt>
                <dd className="mt-1.5 text-xl font-semibold text-white sm:mt-2 sm:text-2xl">Within 24 hrs</dd>
              </div>
              <div className="rounded-3xl border border-white/30 bg-black/30 p-4 backdrop-blur-sm sm:p-5">
                <dt className="text-sm font-medium text-white/80">Service radius</dt>
                <dd className="mt-1.5 text-xl font-semibold text-white sm:mt-2 sm:text-2xl">30 miles</dd>
              </div>
              <div className="rounded-3xl border border-white/30 bg-black/30 p-4 backdrop-blur-sm sm:p-5">
                <dt className="text-sm font-medium text-white/80">Based in</dt>
                <dd className="mt-1.5 text-xl font-semibold text-white sm:mt-2 sm:text-2xl">Aurora, CO</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
