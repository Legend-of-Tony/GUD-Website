import { ServiceIcon } from './SiteIcons'
import type { ServiceOption } from '../types/site'

type ServicesSectionProps = {
  services: ServiceOption[]
  servicesIntroTitle: string
}

export function ServicesSection({ services, servicesIntroTitle }: ServicesSectionProps) {
  return (
    <section id="services" className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl reveal">
          <p className="section-kicker">Services</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{servicesIntroTitle}</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
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
  )
}
