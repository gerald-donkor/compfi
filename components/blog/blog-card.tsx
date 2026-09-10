import Image from "next/image"
import { Calendar, Tag, User } from "lucide-react"

import { Link } from "@/components/ui/link"
import type { BlogPost } from "@/lib/blog"

export interface BlogCardProps {
  post: BlogPost
  priority?: boolean
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const postHref = `/blog#${post.slug}`

  return (
    <article
      id={post.slug}
      className="blog-card"
      data-slot="blog-card"
      aria-labelledby={`blog-title-${post.id}`}
    >
      <div className="blog-card__media">
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={817}
          height={500}
          priority={priority}
          sizes="(min-width: 1280px) 817px, (min-width: 768px) 66vw, 100vw"
          className="blog-card__image"
        />
      </div>

      <ul className="blog-card__meta" aria-label="Article metadata">
        <li className="blog-card__meta-item">
          <User className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>{post.author}</span>
        </li>
        <li className="blog-card__meta-item">
          <Calendar className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <time dateTime={post.dateTime}>{post.date}</time>
        </li>
        <li className="blog-card__meta-item">
          <Tag className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>{post.category}</span>
        </li>
      </ul>

      <h2 id={`blog-title-${post.id}`} className="blog-card__title">
        <Link href={postHref} className="blog-card__title-link">
          {post.title}
        </Link>
      </h2>

      <p className="blog-card__excerpt">{post.excerpt}</p>

      <div className="blog-card__actions">
        <Link href={postHref} className="blog-card__read-more">
          Read more{" "}
          <span className="sr-only">about {post.title}</span>
        </Link>
      </div>
    </article>
  )
}
