import type { ChangeEvent } from 'react'
import { IconSelect, ImageUploadField, TextAreaInput, TextInput } from './AdminFields'
import type { GalleryProject, ServiceOption, SiteContent, Testimonial } from '../../types/site'

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

export function AdminView({
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
      onImport(parsed)
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
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{importError}</div>
        ) : null}

        {saveStatus ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700">{saveStatus}</div>
        ) : null}

        <BrandSection
          businessName={content.businessName}
          featuredImage={content.featuredImage}
          heroBadge={content.heroBadge}
          heroDescription={content.heroDescription}
          logoImage={content.logoImage}
          onBusinessNameChange={(value) => updateContent('businessName', value)}
          onFeaturedImageChange={(value) => updateContent('featuredImage', value)}
          onHeroBadgeChange={(value) => updateContent('heroBadge', value)}
          onHeroDescriptionChange={(value) => updateContent('heroDescription', value)}
          onLogoImageChange={(value) => updateContent('logoImage', value)}
        />

        <ServicesSection
          services={content.services}
          servicesIntroTitle={content.servicesIntroTitle}
          onAdd={addService}
          onIntroTitleChange={(value) => updateContent('servicesIntroTitle', value)}
          onRemove={removeService}
          onUpdate={updateService}
        />

        <GallerySection galleryProjects={content.galleryProjects} onAdd={addGalleryProject} onRemove={removeGalleryProject} onUpdate={updateGalleryProject} />

        <TestimonialsSection
          testimonialTitle={content.testimonialTitle}
          testimonials={content.testimonials}
          onAdd={addTestimonial}
          onHeadingChange={(value) => updateContent('testimonialTitle', value)}
          onRemove={removeTestimonial}
          onUpdate={updateTestimonial}
        />

        <ContactSection
          businessHours={content.businessHours}
          contactTitle={content.contactTitle}
          serviceAreaText={content.serviceAreaText}
          onBusinessHoursChange={(value) => updateContent('businessHours', value)}
          onContactTitleChange={(value) => updateContent('contactTitle', value)}
          onServiceAreaTextChange={(value) => updateContent('serviceAreaText', value)}
        />
      </main>
    </div>
  )
}

type BrandSectionProps = {
  businessName: string
  featuredImage: string
  heroBadge: string
  heroDescription: string
  logoImage: string
  onBusinessNameChange: (value: string) => void
  onFeaturedImageChange: (value: string) => void
  onHeroBadgeChange: (value: string) => void
  onHeroDescriptionChange: (value: string) => void
  onLogoImageChange: (value: string) => void
}

function BrandSection({
  businessName,
  featuredImage,
  heroBadge,
  heroDescription,
  logoImage,
  onBusinessNameChange,
  onFeaturedImageChange,
  onHeroBadgeChange,
  onHeroDescriptionChange,
  onLogoImageChange,
}: BrandSectionProps) {
  return (
    <>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Brand Images</p>
            <ImageUploadField label="Logo" value={logoImage} uploadPath="logos" onChange={onLogoImageChange} />
            <ImageUploadField
              label="Featured Porch Image"
              value={featuredImage}
              uploadPath="featured"
              onChange={onFeaturedImageChange}
            />
          </div>
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Homepage Details</p>
            <TextInput label="Business Name" value={businessName} onChange={onBusinessNameChange} />
            <TextInput label="Hero Badge" value={heroBadge} onChange={onHeroBadgeChange} />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-5">
          <TextAreaInput label="Hero Description" value={heroDescription} rows={4} onChange={onHeroDescriptionChange} />
        </div>
      </section>
    </>
  )
}

type ServicesSectionProps = {
  services: ServiceOption[]
  servicesIntroTitle: string
  onAdd: () => void
  onIntroTitleChange: (value: string) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, nextService: ServiceOption) => void
}

function ServicesSection({ services, servicesIntroTitle, onAdd, onIntroTitleChange, onRemove, onUpdate }: ServicesSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Services</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Edit service cards and quote form options</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">The live site currently shows the section heading and the service cards only.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Add Service
        </button>
      </div>

      <div className="mt-6 grid gap-6">
        <TextInput label="Services Section Heading" value={servicesIntroTitle} onChange={onIntroTitleChange} />
        {services.map((service, index) => (
          <div key={`admin-service-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-stone-50 p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_12rem]">
              <TextInput label={`Service ${index + 1} Title`} value={service.title} onChange={(value) => onUpdate(index, { ...service, title: value })} />
              <IconSelect label="Icon" value={service.icon} onChange={(value) => onUpdate(index, { ...service, icon: value })} />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-5">
              <TextAreaInput label="Description" value={service.description} rows={3} onChange={(value) => onUpdate(index, { ...service, description: value })} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

type GallerySectionProps = {
  galleryProjects: GalleryProject[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, nextProject: GalleryProject) => void
}

function GallerySection({ galleryProjects, onAdd, onRemove, onUpdate }: GallerySectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Manage before and after gallery carousel</h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Add Project
        </button>
      </div>

      <div className="mt-6 grid gap-6">
        {galleryProjects.map((project, index) => (
          <div key={`admin-gallery-project-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-stone-50 p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_10rem]">
              <TextInput label={`Project ${index + 1} Title`} value={project.title} onChange={(value) => onUpdate(index, { ...project, title: value })} />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <ImageUploadField label="Before Image" value={project.beforeImage} uploadPath="gallery/before" onChange={(value) => onUpdate(index, { ...project, beforeImage: value })} />
              <ImageUploadField label="After Image" value={project.afterImage} uploadPath="gallery/after" onChange={(value) => onUpdate(index, { ...project, afterImage: value })} />
            </div>
          </div>
        ))}

        {galleryProjects.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-stone-50 p-5 text-sm text-slate-500">
            Add a project to begin building the gallery carousel. New projects will start with the current featured image until you replace them.
          </div>
        ) : null}
      </div>
    </section>
  )
}

type TestimonialsSectionProps = {
  testimonialTitle: string
  testimonials: Testimonial[]
  onAdd: () => void
  onHeadingChange: (value: string) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, nextTestimonial: Testimonial) => void
}

function TestimonialsSection({
  testimonialTitle,
  testimonials,
  onAdd,
  onHeadingChange,
  onRemove,
  onUpdate,
}: TestimonialsSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Testimonials</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Testimonials shown on the site</h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Add Testimonial
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <TextInput label="Testimonials Section Heading" value={testimonialTitle} onChange={onHeadingChange} />
        {testimonials.map((testimonial, index) => (
          <div key={`admin-testimonial-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-stone-50 p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_10rem]">
              <TextInput label={`Testimonial ${index + 1} Name`} value={testimonial.name} onChange={(value) => onUpdate(index, { ...testimonial, name: value })} />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-5">
              <TextAreaInput label="Quote" value={testimonial.quote} rows={4} onChange={(value) => onUpdate(index, { ...testimonial, quote: value })} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

type ContactSectionProps = {
  businessHours: string
  contactTitle: string
  serviceAreaText: string
  onBusinessHoursChange: (value: string) => void
  onContactTitleChange: (value: string) => void
  onServiceAreaTextChange: (value: string) => void
}

function ContactSection({
  businessHours,
  contactTitle,
  serviceAreaText,
  onBusinessHoursChange,
  onContactTitleChange,
  onServiceAreaTextChange,
}: ContactSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Contact & Footer</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Business details shown on the site</h2>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TextInput label="Service Area Text" value={serviceAreaText} onChange={onServiceAreaTextChange} />
        <TextInput label="Business Hours" value={businessHours} onChange={onBusinessHoursChange} />
        <TextAreaInput label="Contact Section Heading" value={contactTitle} rows={3} onChange={onContactTitleChange} />
      </div>
    </section>
  )
}
