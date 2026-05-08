import { useEffect, useId, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

type ServiceIconName = 'Hammer' | 'Droplets' | 'House' | 'Fence' | 'Grid2x2' | 'ClipboardList'

type ServiceOption = {
  title: string
  description: string
  icon: ServiceIconName
}

type GalleryProject = {
  title: string
  beforeImage: string
  afterImage: string
}

type Testimonial = {
  name: string
  quote: string
}

type SiteContent = {
  businessName: string
  logoImage: string
  featuredImage: string
  heroBadge: string
  heroDescription: string
  servicesIntroTitle: string
  services: ServiceOption[]
  galleryProjects: GalleryProject[]
  testimonialTitle: string
  testimonials: Testimonial[]
  contactTitle: string
  serviceAreaText: string
  businessHours: string
}

type FormState = {
  fullName: string
  phone: string
  email: string
  service: string
  description: string
}

type QuoteRequestPayload = FormState

const adminPath = '/admin'
const serviceIcons: ServiceIconName[] = ['Hammer', 'Droplets', 'House', 'Fence', 'Grid2x2', 'ClipboardList']

const defaultContent: SiteContent = {
  businessName: 'GUD Restoration and Repair LLC',
  logoImage: '/GUD_logo.png',
  featuredImage: '/porch.jpg',
  heroBadge: 'Serving Aurora and nearby communities within 30 miles',
  heroDescription:
    'GUD Restoration and Repair LLC helps homeowners with practical repairs, restoration updates, and clean finished results that improve how a home looks, feels, and functions.',
  servicesIntroTitle: 'Practical services for homeowners who want repair work handled clearly and professionally',
  services: [
    {
      title: 'Interior Repairs',
      description:
        'Reliable repair work for worn, damaged, or unfinished spaces that need to feel solid and ready to use again.',
      icon: 'Hammer',
    },
    {
      title: 'Restoration Updates',
      description: 'Practical restoration work that improves comfort, appearance, and confidence in your home.',
      icon: 'Droplets',
    },
    {
      title: 'Flooring & Finish Work',
      description:
        'Refreshes that help older spaces look cleaner, brighter, and more complete after repair work is done.',
      icon: 'House',
    },
    {
      title: 'Porches & Entryways',
      description:
        'Repairs and upgrades for exterior areas that handle weather, foot traffic, and first impressions.',
      icon: 'Fence',
    },
    {
      title: 'Trim & Detail Work',
      description: 'The finishing touches that help repaired spaces feel polished instead of patched together.',
      icon: 'Grid2x2',
    },
    {
      title: 'Punch List Projects',
      description:
        'A dependable option for homeowners with several repair items that need to be completed the right way.',
      icon: 'ClipboardList',
    },
  ],
  galleryProjects: [
    {
      title: 'Living area restoration',
      beforeImage: '/before/before_1.jpg',
      afterImage: '/after/after_1.jpg',
    },
    {
      title: 'Open room repair and finish update',
      beforeImage: '/before/before_2.jpg',
      afterImage: '/after/after_2.jpg',
    },
    {
      title: 'Interior cleanup and surface refresh',
      beforeImage: '/before/before_3.jpg',
      afterImage: '/after/after_3.jpg',
    },
    {
      title: 'Completed restoration detail',
      beforeImage: '/before/before_4.jpg',
      afterImage: '/after/after_4.jpg',
    },
  ],
  testimonialTitle: 'Homeowners notice the same kind of results shown in the gallery',
  testimonials: [
    {
      name: 'Maria T.',
      quote:
        'The before and after difference in our main living space was exactly what we hoped for. Everything felt cleaner, brighter, and much more finished when the work was done.',
    },
    {
      name: 'Darren L.',
      quote:
        'Our project had a lot of worn details that made the room feel dated. GUD handled the repairs professionally and the final result looked noticeably better right away.',
    },
    {
      name: 'Sharon P.',
      quote:
        'We appreciated how straightforward the whole process was. The work shown in the gallery feels true to what we experienced in our own home: solid repairs and a clean finished look.',
    },
  ],
  contactTitle: "Tell us about the project and we'll get back to you within 24 hours",
  serviceAreaText: 'Aurora, Colorado and communities within a 30-mile radius',
  businessHours: 'Monday to Saturday, 7:00 AM to 6:00 PM',
}

const initialFormState: FormState = {
  fullName: '',
  phone: '',
  email: '',
  service: '',
  description: '',
}

function App() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() =>
    isAdminLocation(window.location.pathname, window.location.search)
  )
  const [authReady, setAuthReady] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [didSubmit, setDidSubmit] = useState(false)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [quoteSubmitMessage, setQuoteSubmitMessage] = useState('All fields are required so we can follow up with the right details.')
  const [quoteSubmitError, setQuoteSubmitError] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [importError, setImportError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const formHeadingId = useId()

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setLoginError(error.message)
      } else {
        setSession(data.session)
      }
      setAuthReady(true)
    }

    void loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoginError('')
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handlePopState = () => setIsAdminRoute(isAdminLocation(window.location.pathname, window.location.search))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const loadContent = async () => {
      const result = await fetchSiteContent()
      if (result.error) {
        setLoadError(result.error)
      } else {
        setContent(result.content)
      }
      setContentReady(true)
    }

    void loadContent()
  }, [])

  useEffect(() => {
    const updateHeaderState = () => {
      const heroThreshold = Math.max(window.innerHeight - 120, 0)
      setIsPastHero(window.scrollY > heroThreshold)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })
    window.addEventListener('resize', updateHeaderState)

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
      window.removeEventListener('resize', updateHeaderState)
    }
  }, [])

  useEffect(() => {
    if (content.galleryProjects.length === 0) {
      setCurrentGalleryIndex(0)
      return
    }

    setCurrentGalleryIndex((current) => current % content.galleryProjects.length)
  }, [content.galleryProjects.length])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { fullName, phone, email, service, description } = formState
    if (!fullName || !phone || !email || !service || !description) {
      setDidSubmit(false)
      setQuoteSubmitError(true)
      setQuoteSubmitMessage('Please complete every field before submitting your quote request.')
      return
    }

    setIsSubmittingQuote(true)
    setQuoteSubmitError(false)
    setQuoteSubmitMessage('')

    const result = await submitQuoteRequest({ fullName, phone, email, service, description })

    if (result.error) {
      setDidSubmit(false)
      setQuoteSubmitError(true)
      setQuoteSubmitMessage(result.error)
    } else {
      setDidSubmit(true)
      setQuoteSubmitError(false)
      setQuoteSubmitMessage('Thanks for reaching out. Your quote request has been sent successfully.')
      setFormState(initialFormState)
    }

    setIsSubmittingQuote(false)
  }

  const currentGalleryProject = content.galleryProjects[currentGalleryIndex] ?? defaultContent.galleryProjects[0]
  const showPreviousGalleryProject = () => {
    setCurrentGalleryIndex((current) =>
      current === 0 ? content.galleryProjects.length - 1 : current - 1
    )
  }

  const showNextGalleryProject = () => {
    setCurrentGalleryIndex((current) =>
      current === content.galleryProjects.length - 1 ? 0 : current + 1
    )
  }

  const closeAdmin = () => {
    window.history.pushState({}, '', '/')
    setIsAdminRoute(false)
  }

  const handleAdminSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSigningIn(true)
    setLoginError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setLoginError(error.message)
    }

    setIsSigningIn(false)
  }

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut()
    closeAdmin()
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('')
    setImportError('')

    const result = await saveSiteContent(content)
    if (result.error) {
      setSaveStatus(result.error)
    } else {
      setSaveStatus('Changes saved to Supabase.')
      setContent(result.content)
    }

    setIsSaving(false)
  }

  if (!authReady || !contentReady) {
    return <LoadingScreen message="Loading website content..." />
  }

  if (isAdminRoute && !session) {
    return (
      <AdminLoginView
        email={loginEmail}
        error={loginError}
        isSigningIn={isSigningIn}
        password={loginPassword}
        onClose={closeAdmin}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onSubmit={handleAdminSignIn}
      />
    )
  }

  if (isAdminRoute && session) {
    return (
      <AdminView
        content={content}
        importError={importError}
        isSaving={isSaving}
        saveStatus={saveStatus}
        userEmail={session.user.email ?? 'Signed-in editor'}
        onClose={closeAdmin}
        onContentChange={setContent}
        onExport={() => exportContent(content)}
        onImport={(nextContent) => {
          setContent(nextContent)
          setImportError('')
          setSaveStatus('Imported locally. Save changes to push them to Supabase.')
        }}
        onImportError={setImportError}
        onReset={() => {
          setContent(defaultContent)
          setImportError('')
          setSaveStatus('Reset locally. Save changes to push the defaults to Supabase.')
        }}
        onSave={handleSave}
        onSignOut={handleAdminSignOut}
      />
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300 sm:h-24 ${
          isPastHero ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center justify-between gap-4">
            <a href="#home" className="pointer-events-auto flex min-w-0 items-center">
              <img
                src={content.logoImage}
                alt={`${content.businessName} logo`}
                className="h-12 w-auto shrink-0 rounded-2xl bg-white p-1.5 sm:h-16"
              />
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

      <main>
        {loadError ? (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
              {loadError}
            </div>
          </div>
        ) : null}

        <section
          id="home"
          className="relative overflow-hidden pt-20 sm:h-[100svh] sm:max-h-[100svh] sm:pt-24"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.68) 0%, rgba(15, 23, 42, 0.48) 36%, rgba(15, 23, 42, 0.3) 62%, rgba(15, 23, 42, 0.52) 100%), url(${content.featuredImage})`,
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">{content.heroBadge}</p>
                <p className="mt-4 text-base leading-7 text-white sm:mt-5 sm:text-xl sm:leading-8">{content.heroDescription}</p>
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

        <section id="services" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-3xl reveal">
              <p className="section-kicker">Services</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {content.servicesIntroTitle}
              </h2>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {content.services.map((service, index) => (
                <article
                  key={`${service.title}-${index}`}
                  className="reveal rounded-[1.75rem] border border-slate-200 bg-stone-50 p-6 shadow-sm"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="inline-flex rounded-2xl bg-rose-100 p-3 text-rose-800">
                    <ServiceIcon icon={service.icon} />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">{service.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="overflow-hidden bg-slate-950 sm:h-[calc(100svh-6rem)] sm:max-h-[calc(100svh-6rem)]">
          <div className="w-full sm:h-full sm:max-h-[calc(100svh-6rem)]">
            <article className="reveal relative bg-slate-950 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] sm:h-full sm:max-h-[calc(100svh-6rem)] sm:overflow-hidden">
              <div className="grid min-h-[42rem] grid-rows-2 sm:h-full sm:min-h-0 sm:grid-cols-2 sm:grid-rows-1">
                <figure className="relative h-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={currentGalleryProject.beforeImage}
                    alt={`${currentGalleryProject.title} before restoration`}
                  />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-sm">
                    Before
                  </figcaption>
                </figure>

                <figure className="relative h-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={currentGalleryProject.afterImage}
                    alt={`${currentGalleryProject.title} after restoration`}
                  />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-sm">
                    After
                  </figcaption>
                </figure>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/45 to-transparent sm:h-40" />

              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-4 sm:p-6 lg:p-8">
                <div className="max-w-2xl text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-sm">Project Gallery</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">
                    {currentGalleryProject.title}
                  </h2>
                </div>

                <div className="hidden text-sm font-medium text-white/75 sm:block">
                  {currentGalleryIndex + 1} / {content.galleryProjects.length}
                </div>
              </div>

              <div className="absolute inset-y-0 left-2 flex items-center sm:left-5">
                <button
                  type="button"
                  aria-label="Show previous gallery project"
                  onClick={showPreviousGalleryProject}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:h-12 sm:w-12"
                >
                  <ChevronLeftIcon />
                </button>
              </div>

              <div className="absolute inset-y-0 right-2 flex items-center sm:right-5">
                <button
                  type="button"
                  aria-label="Show next gallery project"
                  onClick={showNextGalleryProject}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:h-12 sm:w-12"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-3xl reveal">
              <p className="section-kicker text-rose-200">Testimonials</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{content.testimonialTitle}</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {content.testimonials.map((testimonial, index) => (
                <blockquote
                  key={`${testimonial.name}-${index}`}
                  className="reveal rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p className="text-xl leading-9 text-slate-100">"{testimonial.quote}"</p>
                  <footer className="mt-6 text-base font-semibold tracking-wide text-rose-200">{testimonial.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-stone-50 sm:h-[100svh] sm:max-h-[100svh] sm:overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:h-full sm:max-h-[100svh] sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
            <div className="reveal">
              <p className="section-kicker">Contact</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {content.contactTitle}
              </h2>

              <div className="mt-6 space-y-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Best first step</p>
                  <p className="mt-2 text-base leading-7 text-slate-700">Use the quote request form to share project details.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Service Areas</p>
                  <p className="mt-2 text-base leading-7 text-slate-700">{content.serviceAreaText}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Hours</p>
                  <p className="mt-2 text-base leading-7 text-slate-700">{content.businessHours}</p>
                </div>
              </div>
            </div>

            <div
              id="quote-form"
              aria-labelledby={formHeadingId}
              className="reveal rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.4)] sm:p-6"
              style={{ animationDelay: '120ms' }}
            >
              <p className="section-kicker">Quote Request Form</p>
              <h2 id={formHeadingId} className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Request your free quote
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Share a few details below. We'll get back to you within 24 hours.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(value) => setFormState((current) => ({ ...current, fullName: value }))}
                  required
                  autoComplete="name"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={(value) => setFormState((current) => ({ ...current, phone: value }))}
                    required
                    autoComplete="tel"
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={(value) => setFormState((current) => ({ ...current, email: value }))}
                    required
                    autoComplete="email"
                  />
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Service Needed</span>
                  <select
                    name="service"
                    required
                    value={formState.service}
                    onChange={(event) => setFormState((current) => ({ ...current, service: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  >
                    <option value="">Select a service</option>
                    {content.services.map((service, index) => (
                      <option key={`${service.title}-${index}`} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Project Description</span>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formState.description}
                    onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                    placeholder="Tell us about the repair or restoration work you need, your timeline, and any details that would help with the quote."
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-slate-600">We'll get back to you within 24 hours</p>
                  <button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="inline-flex items-center justify-center rounded-full bg-rose-700 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingQuote ? 'Sending...' : 'Submit Quote Request'}
                  </button>
                </div>

                <p
                  aria-live="polite"
                  className={`text-sm font-medium ${
                    didSubmit ? 'text-emerald-700' : quoteSubmitError ? 'text-red-700' : 'text-slate-500'
                  }`}
                >
                  {quoteSubmitMessage}
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-4">
              <img
                src={content.logoImage}
                alt={`${content.businessName} logo`}
                className="h-14 w-14 rounded-2xl border border-slate-200 bg-white p-1"
              />
              <p className="text-xl font-semibold text-slate-950">{content.businessName}</p>
            </div>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-700">
              Restoration and repair work for homeowners who want clear communication, dependable service, and a
              simple quote process.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Contact</p>
            <p className="mt-3 text-base leading-7 text-slate-700">Aurora, Colorado</p>
            <p className="mt-3 text-base leading-7 text-slate-700">Service areas: communities within 30 miles</p>
            <p className="mt-3 text-base leading-7 text-slate-700">Business hours: {content.businessHours}</p>
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
    </div>
  )
}

type AdminLoginViewProps = {
  email: string
  password: string
  error: string
  isSigningIn: boolean
  onClose: () => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function AdminLoginView({
  email,
  password,
  error,
  isSigningIn,
  onClose,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginViewProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Admin Sign In</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Protected CMS access</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Sign in with a Supabase user account before editing services, images, or site content.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <TextInput label="Email" value={email} onChange={onEmailChange} />
          <PasswordInput label="Password" value={password} onChange={onPasswordChange} />

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Back to Site
            </button>
            <button
              type="submit"
              disabled={isSigningIn}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

type AdminViewProps = {
  content: SiteContent
  importError: string
  isSaving: boolean
  saveStatus: string
  userEmail: string
  onClose: () => void
  onContentChange: (content: SiteContent) => void
  onExport: () => void
  onImport: (content: SiteContent) => void
  onImportError: (message: string) => void
  onReset: () => void
  onSave: () => void
  onSignOut: () => void
}

function AdminView({
  content,
  importError,
  isSaving,
  saveStatus,
  userEmail,
  onClose,
  onContentChange,
  onExport,
  onImport,
  onImportError,
  onReset,
  onSave,
  onSignOut,
}: AdminViewProps) {
  const updateContent = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    onContentChange({ ...content, [key]: value })
  }

  const updateService = (index: number, nextService: ServiceOption) => {
    const nextServices = content.services.map((service, serviceIndex) => (serviceIndex === index ? nextService : service))
    updateContent('services', nextServices)
  }

  const addService = () => {
    updateContent('services', [
      ...content.services,
      { title: 'New Service', description: 'Describe the service here.', icon: 'Hammer' },
    ])
  }

  const removeService = (index: number) => {
    updateContent(
      'services',
      content.services.filter((_, serviceIndex) => serviceIndex !== index),
    )
  }

  const updateGalleryProject = (index: number, nextProject: GalleryProject) => {
    const nextProjects = content.galleryProjects.map((project, projectIndex) =>
      projectIndex === index ? nextProject : project,
    )
    updateContent('galleryProjects', nextProjects)
  }

  const addGalleryProject = () => {
    updateContent('galleryProjects', [
      ...content.galleryProjects,
      { title: 'New Project', beforeImage: content.featuredImage, afterImage: content.featuredImage },
    ])
  }

  const removeGalleryProject = (index: number) => {
    updateContent(
      'galleryProjects',
      content.galleryProjects.filter((_, projectIndex) => projectIndex !== index),
    )
  }

  const updateTestimonial = (index: number, nextTestimonial: Testimonial) => {
    const nextTestimonials = content.testimonials.map((testimonial, testimonialIndex) =>
      testimonialIndex === index ? nextTestimonial : testimonial,
    )
    updateContent('testimonials', nextTestimonials)
  }

  const addTestimonial = () => {
    updateContent('testimonials', [
      ...content.testimonials,
      { name: 'New Client', quote: 'Add a testimonial here.' },
    ])
  }

  const removeTestimonial = (index: number) => {
    updateContent(
      'testimonials',
      content.testimonials.filter((_, testimonialIndex) => testimonialIndex !== index),
    )
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as SiteContent
      onImport(mergeWithDefaults(parsed))
    } catch {
      onImportError('That file could not be imported. Please choose a valid CMS export JSON file.')
    }

    event.target.value = ''
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Site CMS</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manage website content</h1>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Signed in as {userEmail}. Changes now save to Supabase instead of browser-only storage.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onExport}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Export JSON
            </button>
            <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-rose-300 hover:bg-rose-50">
              Import JSON
              <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </label>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-rose-300 hover:bg-rose-50"
            >
              View Site
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {importError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {importError}
          </div>
        ) : null}

        {saveStatus ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700">
            {saveStatus}
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Brand Images</p>
              <ImageUploadField
                label="Logo"
                value={content.logoImage}
                uploadPath="logos"
                onChange={(value) => updateContent('logoImage', value)}
              />
              <ImageUploadField
                label="Featured Porch Image"
                value={content.featuredImage}
                uploadPath="featured"
                onChange={(value) => updateContent('featuredImage', value)}
              />
            </div>
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Homepage Details</p>
              <TextInput
                label="Business Name"
                value={content.businessName}
                onChange={(value) => updateContent('businessName', value)}
              />
              <TextInput
                label="Hero Badge"
                value={content.heroBadge}
                onChange={(value) => updateContent('heroBadge', value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            <TextAreaInput
              label="Hero Description"
              value={content.heroDescription}
              rows={4}
              onChange={(value) => updateContent('heroDescription', value)}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Services</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Edit service cards and quote form options</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                The live site currently shows the section heading and the service cards only.
              </p>
            </div>
            <button
              type="button"
              onClick={addService}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Add Service
            </button>
          </div>

          <div className="mt-6 grid gap-6">
            {content.services.map((service, index) => (
              <div key={`admin-service-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-stone-50 p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_1fr_12rem]">
                  <TextInput
                    label={`Service ${index + 1} Title`}
                    value={service.title}
                    onChange={(value) => updateService(index, { ...service, title: value })}
                  />
                  <IconSelect
                    label="Icon"
                    value={service.icon}
                    onChange={(value) => updateService(index, { ...service, icon: value })}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <TextAreaInput
                    label="Description"
                    value={service.description}
                    rows={3}
                    onChange={(value) => updateService(index, { ...service, description: value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Gallery</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Manage before and after gallery carousel</h2>
            </div>
            <button
              type="button"
              onClick={addGalleryProject}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Add Project
            </button>
          </div>

          <div className="mt-6 grid gap-6">
            {content.galleryProjects.map((project, index) => (
              <div key={`admin-gallery-project-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-stone-50 p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_10rem]">
                  <TextInput
                    label={`Project ${index + 1} Title`}
                    value={project.title}
                    onChange={(value) => updateGalleryProject(index, { ...project, title: value })}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeGalleryProject(index)}
                      className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <ImageUploadField
                    label="Before Image"
                    value={project.beforeImage}
                    uploadPath="gallery/before"
                    onChange={(value) => updateGalleryProject(index, { ...project, beforeImage: value })}
                  />
                  <ImageUploadField
                    label="After Image"
                    value={project.afterImage}
                    uploadPath="gallery/after"
                    onChange={(value) => updateGalleryProject(index, { ...project, afterImage: value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Testimonials</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Testimonials shown on the site</h2>
            </div>
            <button
              type="button"
              onClick={addTestimonial}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Add Testimonial
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <TextInput
              label="Testimonials Section Heading"
              value={content.testimonialTitle}
              onChange={(value) => updateContent('testimonialTitle', value)}
            />
            {content.testimonials.map((testimonial, index) => (
              <div key={`admin-testimonial-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-stone-50 p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_10rem]">
                  <TextInput
                    label={`Testimonial ${index + 1} Name`}
                    value={testimonial.name}
                    onChange={(value) => updateTestimonial(index, { ...testimonial, name: value })}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <TextAreaInput
                    label="Quote"
                    value={testimonial.quote}
                    rows={4}
                    onChange={(value) => updateTestimonial(index, { ...testimonial, quote: value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Contact & Footer</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Business details shown on the site</h2>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <TextInput
              label="Service Area Text"
              value={content.serviceAreaText}
              onChange={(value) => updateContent('serviceAreaText', value)}
            />
            <TextInput
              label="Business Hours"
              value={content.businessHours}
              onChange={(value) => updateContent('businessHours', value)}
            />
            <TextAreaInput
              label="Contact Section Heading"
              value={content.contactTitle}
              rows={3}
              onChange={(value) => updateContent('contactTitle', value)}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Loading</p>
        <p className="mt-3 text-lg font-medium text-slate-700">{message}</p>
      </div>
    </div>
  )
}

type TextInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}

function TextInput({ label, value, onChange, type = 'text' }: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <input
        type={type}
        className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function PasswordInput({ label, value, onChange }: TextInputProps) {
  return <TextInput label={label} type="password" value={value} onChange={onChange} />
}

type TextAreaInputProps = {
  label: string
  value: string
  rows?: number
  onChange: (value: string) => void
}

function TextAreaInput({ label, value, rows = 4, onChange }: TextAreaInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <textarea
        rows={rows}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

type IconSelectProps = {
  label: string
  value: ServiceIconName
  onChange: (value: ServiceIconName) => void
}

function IconSelect({ label, value, onChange }: IconSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        value={value}
        onChange={(event) => onChange(event.target.value as ServiceIconName)}
      >
        {serviceIcons.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
    </label>
  )
}

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void | Promise<void>
  uploadPath: string
}

function ImageUploadField({ label, value, onChange, uploadPath }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState(false)

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploading(true)
    setUploadError(false)
    setUploadMessage('')

    try {
      const uploadedUrl = await uploadImageToStorage(file, uploadPath)
      await onChange(uploadedUrl)
      setUploadMessage('Image uploaded to Supabase Storage.')
    } catch (error) {
      setUploadError(true)
      setUploadMessage(`Upload failed. ${getErrorMessage(error)}`)
    }

    setIsUploading(false)
    event.target.value = ''
  }

  return (
    <div className="space-y-3">
      <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <img src={value} alt={label} className="h-48 w-full rounded-[1.5rem] border border-slate-200 object-cover bg-stone-100" />
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <input
          className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/public-image.jpg or https://..."
        />
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800">
          {isUploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
      <p className="text-sm leading-6 text-slate-500">
        You can paste a public image path or upload a file directly. Uploaded files are stored in Supabase Storage and saved as image URLs.
      </p>
      {uploadMessage ? (
        <p className={`text-sm leading-6 ${uploadError ? 'text-red-600' : 'text-emerald-700'}`}>{uploadMessage}</p>
      ) : null}
    </div>
  )
}

type FormFieldProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
}

function FormField({ label, name, value, onChange, type = 'text', required = false, autoComplete }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

async function submitQuoteRequest(payload: QuoteRequestPayload) {
  const customFunctionUrl = import.meta.env.VITE_QUOTE_FUNCTION_URL

  try {
    if (customFunctionUrl) {
      const response = await fetch(customFunctionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        return { error: data?.error ?? 'Unable to send the quote request right now. Please try again.' }
      }

      return { error: null }
    }

    const { error } = await supabase.functions.invoke('quote-request', {
      body: payload,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}

async function fetchSiteContent() {
  try {
    const [settingsResult, servicesResult, galleryResult, testimonialsResult] = await Promise.all([
      supabase.from('site_settings').select('*').order('id', { ascending: true }).limit(1),
      supabase.from('services').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery_projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
    ])

    const error =
      settingsResult.error ??
      servicesResult.error ??
      galleryResult.error ??
      testimonialsResult.error

    if (error) {
      return {
        content: defaultContent,
        error: `Supabase content could not be loaded. Showing defaults instead. ${error.message}`,
      }
    }

    const settings = settingsResult.data?.[0]

    return {
      content: mergeWithDefaults({
        businessName: settings?.business_name ?? defaultContent.businessName,
        logoImage: settings?.logo_image ?? defaultContent.logoImage,
        featuredImage: settings?.featured_image ?? defaultContent.featuredImage,
        heroBadge: settings?.hero_badge ?? defaultContent.heroBadge,
        heroDescription: settings?.hero_description ?? defaultContent.heroDescription,
        servicesIntroTitle: settings?.services_intro_title ?? defaultContent.servicesIntroTitle,
        testimonialTitle: settings?.testimonial_title ?? defaultContent.testimonialTitle,
        contactTitle: settings?.contact_title ?? defaultContent.contactTitle,
        serviceAreaText: settings?.service_area_text ?? defaultContent.serviceAreaText,
        businessHours: settings?.business_hours ?? defaultContent.businessHours,
        services:
          servicesResult.data?.map((service) => ({
            title: service.title,
            description: service.description,
            icon: asServiceIcon(service.icon),
          })) ?? defaultContent.services,
        galleryProjects:
          galleryResult.data?.map((project) => ({
            title: project.title,
            beforeImage: project.before_image ?? '',
            afterImage: project.after_image ?? '',
          })) ?? defaultContent.galleryProjects,
        testimonials:
          testimonialsResult.data?.map((testimonial) => ({
            name: testimonial.name,
            quote: testimonial.quote,
          })) ?? defaultContent.testimonials,
      }),
      error: '',
    }
  } catch (error) {
    return {
      content: defaultContent,
      error: `Supabase content could not be loaded. Showing defaults instead. ${getErrorMessage(error)}`,
    }
  }
}

async function saveSiteContent(content: SiteContent) {
  try {
    const settingsResult = await supabase.from('site_settings').select('id').order('id', { ascending: true }).limit(1)
    if (settingsResult.error) {
      throw settingsResult.error
    }

    const settingsPayload = {
      business_name: content.businessName,
      logo_image: content.logoImage,
      featured_image: content.featuredImage,
      hero_badge: content.heroBadge,
      hero_description: content.heroDescription,
      services_intro_title: content.servicesIntroTitle,
      testimonial_title: content.testimonialTitle,
      contact_title: content.contactTitle,
      service_area_text: content.serviceAreaText,
      business_hours: content.businessHours,
      updated_at: new Date().toISOString(),
    }

    if (settingsResult.data && settingsResult.data.length > 0) {
      const updateResult = await supabase
        .from('site_settings')
        .update(settingsPayload)
        .eq('id', settingsResult.data[0].id)
      if (updateResult.error) {
        throw updateResult.error
      }
    } else {
      const insertResult = await supabase.from('site_settings').insert(settingsPayload)
      if (insertResult.error) {
        throw insertResult.error
      }
    }

    await replaceTableRows('services', content.services.map((service, index) => ({
      title: service.title,
      description: service.description,
      icon: service.icon,
      sort_order: index + 1,
    })))

    await replaceTableRows('gallery_projects', content.galleryProjects.map((project, index) => ({
      title: project.title,
      before_image: project.beforeImage,
      after_image: project.afterImage,
      sort_order: index + 1,
    })))

    await replaceTableRows('testimonials', content.testimonials.map((testimonial, index) => ({
      name: testimonial.name,
      quote: testimonial.quote,
      sort_order: index + 1,
    })))

    const refreshed = await fetchSiteContent()
    return { content: refreshed.content, error: '' }
  } catch (error) {
    return {
      content,
      error: `Supabase save failed. ${getErrorMessage(error)}`,
    }
  }
}

async function replaceTableRows(table: 'services' | 'gallery_projects' | 'testimonials', rows: object[]) {
  const deleteResult = await supabase.from(table).delete().gte('id', 0)
  if (deleteResult.error) {
    throw deleteResult.error
  }

  if (rows.length === 0) {
    return
  }

  const insertResult = await supabase.from(table).insert(rows)
  if (insertResult.error) {
    throw insertResult.error
  }
}

function asServiceIcon(icon: string): ServiceIconName {
  return serviceIcons.includes(icon as ServiceIconName) ? (icon as ServiceIconName) : 'Hammer'
}

function isAdminLocation(pathname: string, search: string) {
  if (pathname === adminPath || pathname === `${adminPath}/`) {
    return true
  }

  return new URLSearchParams(search).get('admin') === '1'
}

function mergeWithDefaults(content: Partial<SiteContent>) {
  return {
    ...defaultContent,
    ...content,
    services: Array.isArray(content.services) && content.services.length > 0 ? content.services : defaultContent.services,
    galleryProjects:
      Array.isArray(content.galleryProjects) && content.galleryProjects.length > 0
        ? content.galleryProjects
        : defaultContent.galleryProjects,
    testimonials:
      Array.isArray(content.testimonials) && content.testimonials.length > 0
        ? content.testimonials
        : defaultContent.testimonials,
  }
}

function exportContent(content: SiteContent) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'gud-site-content.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

async function uploadImageToStorage(file: File, uploadPath: string) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
  const filePath = `${uploadPath}/${Date.now()}-${sanitizedName}`

  const uploadResult = await supabase.storage.from('site-assets').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (uploadResult.error) {
    throw uploadResult.error
  }

  const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath)
  if (!data.publicUrl) {
    throw new Error('Supabase returned an empty public URL for the uploaded image.')
  }

  return data.publicUrl
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}

function ServiceIcon({ icon }: { icon: ServiceIconName }) {
  const commonProps = {
    className: 'h-7 w-7',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  switch (icon) {
    case 'Hammer':
      return (
        <svg {...commonProps}>
          <path d="m14 6 4 4" />
          <path d="m10 10 8-8" />
          <path d="m12 8 4 4" />
          <path d="m8 12 4 4" />
          <path d="M5 19 19 5" />
          <path d="m4 20 4-1 9-9-3-3-9 9-1 4Z" />
        </svg>
      )
    case 'Droplets':
      return (
        <svg {...commonProps}>
          <path d="M12 3c-2.4 3.2-6 6.4-6 10a6 6 0 0 0 12 0c0-3.6-3.6-6.8-6-10Z" />
          <path d="M9 14a3 3 0 0 0 6 0" />
        </svg>
      )
    case 'House':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      )
    case 'Fence':
      return (
        <svg {...commonProps}>
          <path d="M4 21V7l2-3 2 3v14" />
          <path d="M10 21V7l2-3 2 3v14" />
          <path d="M16 21V7l2-3 2 3v14" />
          <path d="M4 12h16" />
        </svg>
      )
    case 'Grid2x2':
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'ClipboardList':
      return (
        <svg {...commonProps}>
          <path d="M9 4h6" />
          <path d="M10 2h4a1 1 0 0 1 1 1v2H9V3a1 1 0 0 1 1-1Z" />
          <path d="M8 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1" />
          <path d="m9 11 1.5 1.5L15 8" />
          <path d="M9 17h6" />
        </svg>
      )
    default:
      return null
  }
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export default App
