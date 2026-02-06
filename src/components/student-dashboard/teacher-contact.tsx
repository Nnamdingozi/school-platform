"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, User } from "lucide-react"

interface Teacher {
  name: string
  role: string
  subject: string
  avatar?: string
  email: string
  available: boolean
}

const classTeacher: Teacher = {
  name: "Mrs. Folake Adebayo",
  role: "Class Teacher",
  subject: "Mathematics",
  email: "f.adebayo@school.edu",
  available: true,
}

export function TeacherContact() {
  const initials = classTeacher.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Class Teacher
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={classTeacher.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {classTeacher.available && (
              <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-success">
                <span className="sr-only">Online</span>
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {classTeacher.name}
            </h3>
            <p className="text-sm text-muted-foreground">{classTeacher.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {classTeacher.subject}
              </Badge>
              {classTeacher.available && (
                <Badge variant="outline" className="text-xs text-success border-success/30">
                  Available
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button className="flex-1 gap-2" size="sm">
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email</span>
          </Button>
        </div>

        {/* Quick Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{classTeacher.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
