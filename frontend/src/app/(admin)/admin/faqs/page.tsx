"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import type { FAQ } from "@/types"
import { Plus, Trash2 } from "lucide-react"

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ question: "", answer: "", category: "", sortOrder: 0, published: true })

  useEffect(() => { loadFAQs() }, [])

  async function loadFAQs() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await api.get<{ success: boolean; data: FAQ[] }>("/faqs", token || undefined)
      setFaqs(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const token = localStorage.getItem("admin_token")
      await api.post("/faqs", form, token || undefined)
      setForm({ question: "", answer: "", category: "", sortOrder: 0, published: true })
      setShowForm(false)
      loadFAQs()
    } catch (err) { console.error(err) }
  }

  async function deleteFAQ(id: string) {
    if (!confirm("Delete this FAQ?")) return
    try {
      const token = localStorage.getItem("admin_token")
      await api.delete(`/faqs/${id}`, token || undefined)
      loadFAQs()
    } catch (err) { console.error(err) }
  }

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">FAQs</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" />Add FAQ</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                    <span className="text-sm font-medium">Published</span>
                  </label>
                </div>
              </div>
              <Button type="submit">Save FAQ</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>All FAQs ({faqs.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{faq.question}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
                  {faq.category && <Badge variant="outline" className="mt-1">{faq.category}</Badge>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteFAQ(faq.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
          {faqs.length === 0 && <p className="text-center text-muted-foreground py-4">No FAQs yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
