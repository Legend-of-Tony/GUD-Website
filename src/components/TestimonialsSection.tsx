import type { Testimonial } from '../types/site'

type TestimonialsSectionProps = {
  testimonialTitle: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonialTitle, testimonials }: TestimonialsSectionProps) {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl reveal">
          <p className="section-kicker text-rose-200">Testimonials</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{testimonialTitle}</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
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
  )
}
