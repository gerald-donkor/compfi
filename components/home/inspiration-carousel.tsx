"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "cn"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel, type CarouselApi } from "@/components/ui/carousel"
import { Link } from "@/components/ui/link"
import type { InspirationSlide } from "@/lib/home-editorial"

export type InspirationCarouselProps = Omit<React.ComponentProps<"div">, "children"> & Readonly<{ slides: readonly InspirationSlide[] }>

function CarouselControls({ slides }: InspirationCarouselProps) {
  const { api } = useCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(query.matches)
    updatePreference()
    query.addEventListener("change", updatePreference)
    return () => query.removeEventListener("change", updatePreference)
  }, [])

  React.useEffect(() => {
    if (!api) return
    const updateSelection = (embla: CarouselApi) => setSelectedIndex(embla?.selectedScrollSnap() ?? 0)
    updateSelection(api)
    api.on("select", updateSelection)
    api.on("reInit", updateSelection)
    return () => {
      api.off("select", updateSelection)
      api.off("reInit", updateSelection)
    }
  }, [api])

  return (
    <div className="home-inspiration__controls">
      <div className="home-inspiration__arrows">
        <CarouselPrevious jump={reduceMotion} aria-label="Previous room" />
        <CarouselNext jump={reduceMotion} aria-label="Next room" />
      </div>
      <div className="home-inspiration__dots" aria-label="Choose a room">
        {slides.map((slide, index) => (
          <button key={slide.id} type="button" className="home-inspiration__dot" aria-label={`Go to room ${index + 1}: ${slide.title}`} aria-current={selectedIndex === index ? "true" : undefined} onClick={() => { api?.scrollTo(index, reduceMotion); setSelectedIndex(index) }}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Room {selectedIndex + 1} of {slides.length}: {slides[selectedIndex]?.title}</p>
    </div>
  )
}

export function InspirationCarousel({ slides, className, ...props }: InspirationCarouselProps) {
  if (slides.length === 0) return null

  return (
    <Carousel className={cn("home-inspiration__carousel", className)} aria-label="Room inspiration" opts={{ align: "start", containScroll: "trimSnaps", watchDrag: true }} {...props}>
      <CarouselContent className="home-inspiration__track">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="home-inspiration__slide" aria-label={`${index + 1} of ${slides.length}`}>
            <figure className="home-inspiration__figure">
              <Image src={slide.image.src} alt={slide.image.alt} width={slide.image.width} height={slide.image.height} sizes="(min-width: 1024px) 404px, (min-width: 768px) 62vw, 82vw" className="home-inspiration__image" />
              <figcaption className="home-inspiration__caption">
                <p className="type-label text-muted">{slide.eyebrow}</p>
                <h3 className="type-heading-md">{slide.title}</h3>
                <Link href={slide.href} variant="primary">{slide.actionLabel}</Link>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls slides={slides} />
    </Carousel>
  )
}
