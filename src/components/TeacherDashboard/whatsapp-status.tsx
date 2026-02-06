"use client"

import { MessageCircle, Check, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const feedbackStatuses = [
  {
    id: 1,
    assessment: "Week 5 Quiz - Quadratic Equations",
    date: "Jan 28, 2026",
    sent: 42,
    pending: 3,
    status: "partial",
  },
  {
    id: 2,
    assessment: "Class Assignment 4",
    date: "Jan 25, 2026",
    sent: 45,
    pending: 0,
    status: "complete",
  },
  {
    id: 3,
    assessment: "Mid-Term Test",
    date: "Jan 20, 2026",
    sent: 44,
    pending: 1,
    status: "partial",
  },
  {
    id: 4,
    assessment: "Week 4 Quiz - Indices",
    date: "Jan 18, 2026",
    sent: 45,
    pending: 0,
    status: "complete",
  },
]

export function WhatsAppStatus() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">WhatsApp Feedback Status</CardTitle>
        </div>
        <CardDescription>
          Recent assessment feedback sent to parents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feedbackStatuses.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    item.status === "complete"
                      ? "bg-primary/10 text-primary"
                      : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {item.status === "complete" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.assessment}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === "complete" ? (
                  <Badge className="bg-primary/10 text-primary">
                    {item.sent} sent
                  </Badge>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Badge className="bg-primary/10 text-primary">
                      {item.sent} sent
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/30">
                      <AlertCircle className="h-3 w-3" />
                      {item.pending} pending
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
