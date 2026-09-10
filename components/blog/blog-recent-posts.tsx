import Image from "next/image"

import { Link } from "@/components/ui/link"
import type { BlogPost } from "@/lib/blog"

export interface BlogRecentPostsProps {
  posts: readonly BlogPost[]
}

export function BlogRecentPosts({ posts }: BlogRecentPostsProps) {
  return (
    <section
      className="blog-recent-posts"
      data-slot="blog-recent-posts"
      aria-labelledby="blog-recent-posts-heading"
    >
      <h3
        id="blog-recent-posts-heading"
        className="blog-sidebar__heading text-2xl font-medium text-foreground"
      >
        Recent Posts
      </h3>

      <ul className="blog-recent-posts__list mt-6 flex flex-col gap-6">
        {posts.map((post) => {
          const postHref = `/blog#${post.slug}`

          return (
            <li key={post.id} className="blog-recent-posts__item flex items-center gap-4">
              <Link
                href={postHref}
                className="blog-recent-posts__thumb relative shrink-0 overflow-hidden bg-wash focus:outline-none focus:ring-2 focus:ring-brand-focus"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={post.thumbnail || post.image}
                  alt=""
                  width={80}
                  height={80}
                  className="size-full object-cover"
                />
              </Link>
              <div className="blog-recent-posts__info min-w-0 flex-1">
                <h4 className="blog-recent-posts__title text-sm font-normal leading-snug text-foreground line-clamp-2">
                  <Link
                    href={postHref}
                    className="hover:text-brand-action focus:outline-none focus:ring-2 focus:ring-brand-focus"
                  >
                    {post.title}
                  </Link>
                </h4>
                <p className="blog-recent-posts__date mt-1 text-xs text-muted">
                  <time dateTime={post.dateTime}>{post.date}</time>
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
