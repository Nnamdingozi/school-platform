"use client"

import React from "react"
import { Sparkles, BookOpen, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ActiveTopicCard() {
    return (
        <Card className="border-primary/20 bg-card">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">Active Now</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        In Progress
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Term 2</p>
                        <h3 className="text-lg font-semibold text-foreground">Quadratic Equations</h3>
                        <p className="text-sm text-muted-foreground">
                            Solving equations using factorization and formula methods
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>Week 6 of 12</span>
                    </div>
                    <span>•</span>
                    <span>45 students enrolled</span>
                </div>
                <Button className="w-full gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate AI Lesson Plan
                </Button>
            </CardContent>
        </Card>
    )
}
