"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { Product, Category } from "@/types"
import { Search } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    Promise.all([
      api.get<{ success: boolean; products: Product[] }>("/products").then(r => setProducts(r.products)),
      api.get<{ success: boolean; data: Category[] }>("/categories").then(r => setCategories(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return p.published
  })

  if (loading) return <div className="container mx-auto px-4 py-12 grid gap-6 md:grid-cols-3"><Skeleton className="h-48" /><Skeleton className="h-48" /><Skeleton className="h-48" /></div>

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">Our Products</h1>
      <p className="mt-2 text-muted-foreground">Explore our range of AI-powered business solutions</p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{product.category?.name}</Badge>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <p className="mt-4 text-2xl font-bold text-primary">
                  ${Number(product.basePrice).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-12">No products found.</p>
        )}
      </div>
    </div>
  )
}
