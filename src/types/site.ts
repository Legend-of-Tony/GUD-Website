export type ServiceIconName = 'Hammer' | 'Droplets' | 'House' | 'Fence' | 'Grid2x2' | 'ClipboardList'

export type ServiceOption = {
  title: string
  description: string
  icon: ServiceIconName
}

export type GalleryProject = {
  title: string
  beforeImage: string
  afterImage: string
}

export type Testimonial = {
  name: string
  quote: string
}

export type SiteContent = {
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

export type FormState = {
  fullName: string
  phone: string
  email: string
  service: string
  description: string
}

export type QuoteRequestPayload = FormState
