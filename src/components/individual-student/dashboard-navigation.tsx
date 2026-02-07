'use client'

import React from "react"

import { BookOpen, Brain, Compass, LayoutGrid, Library } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { id: 'learning-path', label: 'Learning Path', icon: <LayoutGrid className="h-5 w-5" /> },
  { id: 'explore', label: 'Explore Subjects', icon: <Compass className="h-5 w-5" /> },
  { id: 'progress', label: 'My Progress', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'tutor', label: 'AI Tutor', icon: <Brain className="h-5 w-5" /> },
  { id: 'library', label: 'Library', icon: <Library className="h-5 w-5" /> },
]

interface DashboardNavigationProps {
  onNavigate?: (id: string) => void
}

export function DashboardNavigation({ onNavigate }: DashboardNavigationProps) {
  const [activeNav, setActiveNav] = useState('learning-path')

  const handleClick = (id: string) => {
    setActiveNav(id)
    onNavigate?.(id)
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="px-6">
        <div className="flex gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors',
                activeNav === item.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
