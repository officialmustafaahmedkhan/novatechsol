"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { News } from "@/types"

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ success: boolean; news: News[] }>("/news?published=true")
      .then(r => setNews(r.news))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container mx-auto px-4 py-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-48" /><Skeleton className="h-48" /><Skeleton className="h-48" /></div>

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">News & Updates</h1>
      <p className="mt-2 text-muted-foreground">Stay informed with the latest company news and industry insights</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((article) => (
          <Link key={article.id} href={`/news/${article.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              {article.image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {article.author} &middot; {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt || article.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {news.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-12">No news articles yet.</p>
        )}
      </div>
    </div>
  )
}
