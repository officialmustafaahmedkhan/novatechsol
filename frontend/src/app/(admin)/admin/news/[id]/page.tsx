"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { News } from "@/types"

export default function NewsEditPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === "new"
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", image: "", author: "", published: false })

  useEffect(() => { if (!isNew) loadArticle() }, [])

  async function loadArticle() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await api.get<{ success: boolean; data: News }>(`/news/${params.id}`, token || undefined)
      const a = res.data
      setForm({ title: a.title, slug: a.slug, content: a.content, excerpt: a.excerpt || "", image: a.image || "", author: a.author, published: a.published })
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem("admin_token")
      if (isNew) await api.post("/news", form, token || undefined)
      else await api.put(`/news/${params.id}`, form, token || undefined)
      router.push("/admin/news")
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{isNew ? "New Article" : "Edit Article"}</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Content (Markdown supported)</Label>
              <Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <span className="text-sm font-medium">Published</span>
            </label>
          </CardContent>
        </Card>
        <div className="mt-4 flex gap-4">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Article"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
