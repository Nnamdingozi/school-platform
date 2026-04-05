'use client'

import { use, useEffect, useState } from "react"
import { useProfileStore } from "@/store/profileStore"
import { getLessonForTopic } from "@/app/actions/lesson.actions"
import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
import { ArrowLeft, BookOpen, Loader2} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface PageProps {
    params: Promise<{ topicId: string }>
}

export default function LessonStudioPage({ params }: PageProps) {
    const { topicId } = use(params)
    const { profile, isLoading: isProfileLoading } = useProfileStore()
    
    // ✅ FIX: Track the ID separately or wrap the state
    const [lessonId, setLessonId] = useState<string>("")
    const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)
    const [isPrivateEdit, setIsPrivateEdit] = useState(false)
    const [loading, setLoading] = useState(true)

    const schoolId = profile?.schoolId ?? ''

    useEffect(() => {
        if (!schoolId || !topicId) return

        async function fetchContent() {
            setLoading(true)
            const res = await getLessonForTopic(topicId, schoolId)
            
            if (res.success && res.data) {
                // ✅ FIX: Extract id from data, and aiContent for the planner
                setLessonId(res.data.id)
                setLessonContent(res.data.aiContent as unknown as EnhancedLessonContent)
                setIsPrivateEdit(res.data.isPrivate)
            }
            setLoading(false)
        }

        fetchContent()
    }, [topicId, schoolId])

    if (isProfileLoading || loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                <p className="text-slate-500 font-mono text-[10px] uppercase mt-4">Syncing_Vault...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8 bg-slate-950 min-h-screen text-slate-50">
            <header className="space-y-6">
                <Link href="/teacher" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 transition-all w-fit">
                    <ArrowLeft className="h-3 w-3" /> Dashboard
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
                            <BookOpen className="h-7 w-7 text-school-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Lesson Studio</h1>
                                {isPrivateEdit && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                        Customized
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Topic: <span className="text-slate-300">Curriculum Development Hub</span></p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto">
                <AILessonPlanner 
                    topicId={topicId}
                    schoolId={schoolId}
                    // ✅ Passed the correctly extracted lessonId
                    lessonId={lessonId}
                    topicTitle={lessonContent?.studentContent.title ?? "New Subject Node"}
                    initialData={lessonContent}
                />
            </main>
        </div>
    )
}