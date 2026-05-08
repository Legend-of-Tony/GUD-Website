import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AdminLoginView } from './components/admin/AdminLoginView'
import { AdminView } from './components/admin/AdminView'
import { LoadingScreen } from './components/admin/LoadingScreen'
import { supabase } from './lib/supabase'
import { ContactSection } from './components/ContactSection'
import { GallerySection } from './components/GallerySection'
import { HeroSection } from './components/HeroSection'
import { ServicesSection } from './components/ServicesSection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { TestimonialsSection } from './components/TestimonialsSection'
import type { FormState, QuoteRequestPayload, ServiceIconName, SiteContent } from './types/site'

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
      <SiteHeader businessName={content.businessName} isPastHero={isPastHero} logoImage={content.logoImage} />

      <main>
        {loadError ? (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
              {loadError}
            </div>
          </div>
        ) : null}

        <HeroSection
          featuredImage={content.featuredImage}
          heroBadge={content.heroBadge}
          heroDescription={content.heroDescription}
        />
        <ServicesSection services={content.services} servicesIntroTitle={content.servicesIntroTitle} />
        <GallerySection
          currentGalleryIndex={currentGalleryIndex}
          currentGalleryProject={currentGalleryProject}
          galleryProjectsCount={content.galleryProjects.length}
          onNext={showNextGalleryProject}
          onPrevious={showPreviousGalleryProject}
        />
        <TestimonialsSection testimonialTitle={content.testimonialTitle} testimonials={content.testimonials} />
        <ContactSection
          contactTitle={content.contactTitle}
          didSubmit={didSubmit}
          formHeadingId={formHeadingId}
          formState={formState}
          isSubmittingQuote={isSubmittingQuote}
          quoteSubmitError={quoteSubmitError}
          quoteSubmitMessage={quoteSubmitMessage}
          serviceAreaText={content.serviceAreaText}
          businessHours={content.businessHours}
          services={content.services}
          onFieldChange={(key, value) => setFormState((current) => ({ ...current, [key]: value }))}
          onSubmit={handleSubmit}
        />
      </main>

      <SiteFooter businessName={content.businessName} businessHours={content.businessHours} logoImage={content.logoImage} />
    </div>
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}

export default App
