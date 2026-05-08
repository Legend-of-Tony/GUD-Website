import { ChevronLeftIcon, ChevronRightIcon } from './SiteIcons'
import type { GalleryProject } from '../types/site'

type GallerySectionProps = {
  currentGalleryIndex: number
  currentGalleryProject: GalleryProject
  galleryProjectsCount: number
  onNext: () => void
  onPrevious: () => void
}

export function GallerySection({
  currentGalleryIndex,
  currentGalleryProject,
  galleryProjectsCount,
  onNext,
  onPrevious,
}: GallerySectionProps) {
  return (
    <section id="gallery" className="overflow-hidden bg-slate-950 sm:h-[calc(100svh-6rem)] sm:max-h-[calc(100svh-6rem)]">
      <div className="w-full sm:h-full sm:max-h-[calc(100svh-6rem)]">
        <article className="reveal relative bg-slate-950 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] sm:h-full sm:max-h-[calc(100svh-6rem)] sm:overflow-hidden">
          <div className="grid min-h-[42rem] grid-rows-2 sm:h-full sm:min-h-0 sm:grid-cols-2 sm:grid-rows-1">
            <figure className="relative h-full overflow-hidden">
              <img className="h-full w-full object-cover" src={currentGalleryProject.beforeImage} alt={`${currentGalleryProject.title} before restoration`} />
              <figcaption className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-sm">
                Before
              </figcaption>
            </figure>

            <figure className="relative h-full overflow-hidden">
              <img className="h-full w-full object-cover" src={currentGalleryProject.afterImage} alt={`${currentGalleryProject.title} after restoration`} />
              <figcaption className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-sm">
                After
              </figcaption>
            </figure>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/45 to-transparent sm:h-40" />

          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-sm">Project Gallery</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">{currentGalleryProject.title}</h2>
            </div>

            <div className="hidden text-sm font-medium text-white/75 sm:block">
              {currentGalleryIndex + 1} / {galleryProjectsCount}
            </div>
          </div>

          <div className="absolute inset-y-0 left-2 flex items-center sm:left-5">
            <button
              type="button"
              aria-label="Show previous gallery project"
              onClick={onPrevious}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:h-12 sm:w-12"
            >
              <ChevronLeftIcon />
            </button>
          </div>

          <div className="absolute inset-y-0 right-2 flex items-center sm:right-5">
            <button
              type="button"
              aria-label="Show next gallery project"
              onClick={onNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:h-12 sm:w-12"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}
