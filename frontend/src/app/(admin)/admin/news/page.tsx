"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { News, Pagination } from "@/types"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await api.get<{ success: boolean; news: News[] }>("/news?limit=50", token || undefined)
      setNews(res.news)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function deleteNews(id: string) {
    if (!confirm("Delete this article?")) return
    try {
      const token = localStorage.getItem("admin_token")
      await api.delete(`/news/${id}`, token || undefined)
      loadNews()
    } catch (err) { console.error(err) }
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">News</h1>
        <Button asChild><Link href="/admin/news/new"><Plus className="mr-2 h-4 w-4" />New Article</Link></Button>
      </div>
      <Card>
        <CardHeader><CardTitle>All Articles ({news.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.map((article) => (
              <div key={article.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{article.title}</p>
                  <p className="text-sm text-muted-foreground">{article.author} &middot; {new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={article.published ? "success" : "secondary"}>{article.published ? "Published" : "Draft"}</Badge>
                  <Button variant="ghost" size="icon" asChild><Link href={`/admin/news/${article.id}`}><Edit className="h-4 w-4" /></Link></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteNews(article.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-center text-muted-foreground py-8">No articles yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
