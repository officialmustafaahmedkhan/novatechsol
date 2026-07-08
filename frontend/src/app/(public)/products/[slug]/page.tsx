"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    api.get<{ success: boolean; data: Product }>(`/products/slug/${params.slug}`)
      .then(r => setProduct(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.slug])

  if (loading) return <div className="container mx-auto px-4 py-12"><Skeleton className="h-96" /></div>
  if (!product) return <div className="container mx-auto px-4 py-12 text-center">Product not found</div>

  const currentPrice = product.pricing?.[0]
  const images = product.images || []

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[currentImage]?.url}
                alt={images[currentImage]?.alt || product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <p className="text-muted-foreground">No image available</p>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentImage(i => Math.max(0, i - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{currentImage + 1} / {images.length}</span>
              <Button variant="outline" size="icon" onClick={() => setCurrentImage(i => Math.min(images.length - 1, i + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <Badge variant="secondary">{product.category?.name}</Badge>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-3xl font-bold text-primary">
                  {currentPrice ? formatCurrency(Number(currentPrice.price), product.currency) : formatCurrency(Number(product.basePrice), product.currency)}
                </p>
                {currentPrice?.effectiveTo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Valid until {new Date(currentPrice.effectiveTo).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button asChild size="lg" className="w-full">
              <Link href="/contact">Request Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
