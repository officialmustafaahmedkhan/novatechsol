"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { News } from "@/types"
import { ArrowLeft } from "lucide-react"

export default function NewsArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ success: boolean; data: News }>(`/news/slug/${params.slug}`)
      .then(r => setArticle(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.slug])

  if (loading) return <div className="container mx-auto px-4 py-12"><Skeleton className="h-64" /></div>
  if (!article) return <div className="container mx-auto px-4 py-12 text-center">Article not found</div>

  return (
    <article className="container mx-auto px-4 py-12">
      <Link href="/news" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to News
      </Link>

      {article.image && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          By {article.author} &middot; {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
        </p>
        {article.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground italic">{article.excerpt}</p>
        )}
        <div className="mt-8 text-muted-foreground leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </article>
  )
}
