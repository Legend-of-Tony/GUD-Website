import type { FormEvent } from 'react'
import type { FormState, ServiceOption } from '../types/site'

type ContactSectionProps = {
  contactTitle: string
  didSubmit: boolean
  formHeadingId: string
  formState: FormState
  isSubmittingQuote: boolean
  quoteSubmitError: boolean
  quoteSubmitMessage: string
  serviceAreaText: string
  businessHours: string
  services: ServiceOption[]
  onFieldChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ContactSection({
  contactTitle,
  didSubmit,
  formHeadingId,
  formState,
  isSubmittingQuote,
  quoteSubmitError,
  quoteSubmitMessage,
  serviceAreaText,
  businessHours,
  services,
  onFieldChange,
  onSubmit,
}: ContactSectionProps) {
  return (
    <section id="contact" className="bg-stone-50 sm:h-[100svh] sm:max-h-[100svh] sm:overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:h-full sm:max-h-[100svh] sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        <div className="reveal">
          <p className="section-kicker">Contact</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{contactTitle}</h2>

          <div className="mt-6 space-y-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Best first step</p>
              <p className="mt-2 text-base leading-7 text-slate-700">Use the quote request form to share project details.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Service Areas</p>
              <p className="mt-2 text-base leading-7 text-slate-700">{serviceAreaText}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Hours</p>
              <p className="mt-2 text-base leading-7 text-slate-700">{businessHours}</p>
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
          <p className="mt-3 text-base leading-7 text-slate-700">Share a few details below. We'll get back to you within 24 hours.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Full Name</span>
              <input
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                name="fullName"
                required
                autoComplete="name"
                value={formState.fullName}
                onChange={(event) => onFieldChange('fullName', event.target.value)}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Phone Number</span>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={formState.phone}
                  onChange={(event) => onFieldChange('phone', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Email</span>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formState.email}
                  onChange={(event) => onFieldChange('email', event.target.value)}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Service Needed</span>
              <select
                name="service"
                required
                value={formState.service}
                onChange={(event) => onFieldChange('service', event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              >
                <option value="">Select a service</option>
                {services.map((service, index) => (
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
                onChange={(event) => onFieldChange('description', event.target.value)}
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
              className={`text-sm font-medium ${didSubmit ? 'text-emerald-700' : quoteSubmitError ? 'text-red-700' : 'text-slate-500'}`}
            >
              {quoteSubmitMessage}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
