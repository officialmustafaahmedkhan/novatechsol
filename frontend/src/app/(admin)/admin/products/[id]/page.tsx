"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { Product, Category } from "@/types"

export default function ProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === "new"
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    basePrice: 0,
    currency: "USD",
    published: false,
  })

  useEffect(() => {
    loadCategories()
    if (!isNew) loadProduct()
  }, [])

  async function loadCategories() {
    try {
      const res = await api.get<{ success: boolean; data: Category[] }>("/categories")
      setCategories(res.data)
    } catch (err) { console.error(err) }
  }

  async function loadProduct() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await api.get<{ success: boolean; data: Product }>(`/products/${params.id}`, token || undefined)
      const p = res.data
      setForm({
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        categoryId: p.categoryId,
        basePrice: Number(p.basePrice),
        currency: p.currency,
        published: p.published,
      })
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem("admin_token")
      if (isNew) {
        await api.post("/products", form, token || undefined)
      } else {
        await api.put(`/products/${params.id}`, form, token || undefined)
      }
      router.push("/admin/products")
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 w-full" /></div>

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">{isNew ? "New Product" : "Edit Product"}</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price</Label>
                <Input id="price" type="number" step="0.01" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: parseFloat(e.target.value) || 0 })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  <span className="text-sm font-medium">Published</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 flex gap-4">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Product"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
