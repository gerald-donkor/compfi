import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShopLoading() { return <main id="main-content" aria-busy="true"><section className="surface-wash min-h-(--chrome-page-hero-banner-height)" /><section className="surface-wash py-6"><Container><Skeleton className="h-11 w-full" /></Container></section><Container className="py-16"><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="aspect-285/446 w-full" />)}</div></Container></main> }
