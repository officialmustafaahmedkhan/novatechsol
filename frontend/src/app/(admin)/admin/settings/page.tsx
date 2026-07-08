"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    try {
      const res = await api.get<{ success: boolean; data: Record<string, Record<string, string>> }>("/admin/settings")
      setSettings(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function updateSetting(key: string, value: string, group: string) {
    setSaving(key)
    try {
      const token = localStorage.getItem("admin_token")
      await api.put("/admin/settings", { key, value, group }, token || undefined)
      await loadSettings()
    } catch (err) { console.error(err) }
    finally { setSaving(null) }
  }

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Website Settings</h1>
      {Object.entries(settings).map(([group, items]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="capitalize">{group} Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(items).map(([key, value]) => (
              <div key={key} className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                  <Input
                    defaultValue={value}
                    onBlur={(e) => {
                      if (e.target.value !== value) updateSetting(key, e.target.value, group)
                    }}
                  />
                </div>
                {saving === key && <p className="text-sm text-muted-foreground">Saving...</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
