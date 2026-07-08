"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import type { DashboardStats } from "@/types"
import { Package, Newspaper, HelpCircle, MessageSquare, TrendingUp, Users } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("admin_token")
        const res = await api.get<{ success: boolean; data: DashboardStats }>("/admin/dashboard/stats", token || undefined)
        setStats(res.data)
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const cards = [
    { title: "Products", value: stats?.counts.products ?? 0, icon: Package, color: "text-blue-600" },
    { title: "Published", value: stats?.counts.publishedProducts ?? 0, icon: TrendingUp, color: "text-green-600" },
    { title: "News Articles", value: stats?.counts.news ?? 0, icon: Newspaper, color: "text-purple-600" },
    { title: "FAQs", value: stats?.counts.faqs ?? 0, icon: HelpCircle, color: "text-orange-600" },
    { title: "Inquiries", value: stats?.counts.inquiries ?? 0, icon: MessageSquare, color: "text-pink-600" },
    { title: "Users", value: stats?.counts.users ?? 0, icon: Users, color: "text-teal-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="success">{stats?.counts.newInquiries ?? 0} New Inquiries</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.subject}</p>
                  </div>
                  <Badge
                    variant={
                      inquiry.status === "NEW"
                        ? "destructive"
                        : inquiry.status === "READ"
                        ? "warning"
                        : "success"
                    }
                  >
                    {inquiry.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No inquiries yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
