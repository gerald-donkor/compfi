import Image from "next/image"
import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export function CampaignHero() {
  return (
    <section className="home-campaign" aria-labelledby="home-campaign-heading" data-slot="campaign-hero">
      <Image
        src="/images/home/campaign-hero.webp"
        alt=""
        width={1536}
        height={1024}
        sizes="100vw"
        preload
        className="home-campaign__image"
      />
      <div className="home-campaign__panel">
        <p className="type-label home-campaign__label">A calmer home</p>
        <h1 id="home-campaign-heading" className="type-display home-campaign__heading">
          Furniture for considered rooms.
        </h1>
        <p className="type-body-lg text-muted home-campaign__body">
          Explore warm textures, natural materials, and pieces that bring ease to everyday spaces.
        </p>
        <Button render={<NextLink href="/shop" />} nativeButton={false} className="home-campaign__action">
          Shop the collection
        </Button>
      </div>
    </section>
  )
}
