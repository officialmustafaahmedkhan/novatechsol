"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { Inquiry } from "@/types"

const statusColors: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
  NEW: "destructive",
  READ: "warning",
  REPLIED: "success",
  CLOSED: "secondary",
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)

  useEffect(() => { loadInquiries() }, [])

  async function loadInquiries() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await api.get<{ success: boolean; inquiries: Inquiry[] }>("/contact?limit=50", token || undefined)
      setInquiries(res.inquiries)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function updateStatus(id: string, status: Inquiry["status"]) {
    try {
      const token = localStorage.getItem("admin_token")
      await api.put(`/contact/${id}/status`, { status }, token || undefined)
      loadInquiries()
      setSelected(null)
    } catch (err) { console.error(err) }
  }

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inquiries</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>All Inquiries ({inquiries.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                  onClick={() => setSelected(inq)}
                >
                  <div>
                    <p className="font-medium">{inq.name}</p>
                    <p className="text-sm text-muted-foreground">{inq.subject}</p>
                    <p className="text-xs text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={statusColors[inq.status]}>{inq.status}</Badge>
                </div>
              ))}
              {inquiries.length === 0 && <p className="text-center text-muted-foreground py-4">No inquiries.</p>}
            </CardContent>
          </Card>
        </div>

        {selected && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{selected.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
              {selected.phone && <p className="text-sm text-muted-foreground">{selected.phone}</p>}
              {selected.company && <p className="text-sm text-muted-foreground">{selected.company}</p>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Subject: {selected.subject}</p>
                <p className="mt-2 text-sm text-muted-foreground">{selected.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => updateStatus(selected.id, "READ")}>Mark Read</Button>
                <Button size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "REPLIED")}>Mark Replied</Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "CLOSED")}>Close</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
