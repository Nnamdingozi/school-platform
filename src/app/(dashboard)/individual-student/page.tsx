

// 'use client'

// import { useState } from 'react'
// import { DashboardHeader } from '@/components/individual-student/dashboard-header'
// import { DashboardNavigation } from '@/components/individual-student/dashboard-navigation'
// import { ContinueLearningCard } from '@/components/individual-student/continue-learning-card'
// import { SubjectCard } from '@/components/individual-student/subject-card'
// import { AIRecommendations } from '@/components/individual-student/ai-recommendations'
// import { MilestonesSidebar } from '@/components/individual-student/milestones-sidebar'

// // --- Types to prevent 'any' errors ---
// interface Subject {
//   name: string;
//   icon: string;
//   completion: number;
//   color: 'blue' | 'cyan' | 'pink' | 'yellow';
// }

// interface Recommendation {
//   id: string;
//   title: string;
//   description: string;
//   difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
//   estimatedTime: string;
// }

// interface Milestone {
//   id: string;
//   level: number;
//   title: string;
//   icon: string;
//   unlocked: boolean;
//   pointsRequired: number;
// }

// // --- Sample Data ---
// const subjects: Subject[] = [
//   { name: 'Math', icon: '🔢', completion: 80, color: 'blue' },
//   { name: 'Science', icon: '🧪', completion: 65, color: 'cyan' },
//   { name: 'English', icon: '📖', completion: 72, color: 'pink' },
//   { name: 'History', icon: '🏛️', completion: 45, color: 'yellow' },
//   { name: 'Art', icon: '🎨', completion: 55, color: 'pink' },
//   { name: 'Music', icon: '🎵', completion: 38, color: 'blue' },
// ]

// const recommendations: Recommendation[] = [
//   {
//     id: '1',
//     title: 'Quadratic Equations',
//     description: 'Learn how to solve equations with two variables using various methods.',
//     difficulty: 'Intermediate',
//     estimatedTime: '45 minutes',
//   },
//   {
//     id: '2',
//     title: 'Photosynthesis Deep Dive',
//     description: 'Explore the process of photosynthesis and its importance in ecosystems.',
//     difficulty: 'Beginner',
//     estimatedTime: '30 minutes',
//   },
//   {
//     id: '3',
//     title: 'Shakespeare Analysis',
//     description: 'Analyze themes and literary devices in classic Shakespeare works.',
//     difficulty: 'Advanced',
//     estimatedTime: '60 minutes',
//   },
// ]

// const milestones: Milestone[] = [
//   { id: '1', level: 1, title: 'Getting Started', icon: '🌟', unlocked: true, pointsRequired: 100 },
//   { id: '2', level: 2, title: 'Rising Scholar', icon: '📚', unlocked: true, pointsRequired: 500 },
//   { id: '3', level: 3, title: 'Knowledge Master', icon: '🧠', unlocked: false, pointsRequired: 1000 },
//   { id: '4', level: 4, title: 'Expert Learner', icon: '🎓', unlocked: false, pointsRequired: 2000 },
// ]

// export default function DashboardPage() {
//   // ✅ FIX: Use the state variable to drive the UI
//   const [activeNav, setActiveNav] = useState('learning-path')

//   const handleNavigation = (id: string) => {
//     setActiveNav(id)
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <DashboardHeader userName="Alex" streak={12} learningPoints={750} />

//       {/* Navigation */}
//       <DashboardNavigation onNavigate={handleNavigation} />

//       {/* Main Content */}
//       <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          
//           {/* Main Content Area */}
//           <div className="lg:col-span-2 space-y-10">
            
//             {/* Show specific content based on activeNav */}
//             {activeNav === 'learning-path' && (
//               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                 <ContinueLearningCard
//                   topic="Fractions & Decimals"
//                   subject="Mathematics"
//                   progress={80}
//                   nextUp="Long Division"
//                 />
                
//                 <AIRecommendations recommendations={recommendations} />
//               </div>
//             )}

//             {/* Always show subjects or show only when tab selected */}
//             {(activeNav === 'learning-path' || activeNav === 'subjects') && (
//               <section className="animate-in fade-in duration-500">
//                 <h2 className="mb-6 text-2xl font-bold text-foreground">
//                   {activeNav === 'subjects' ? 'All Subjects' : 'Explore Subjects'}
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
//                   {subjects.map((subject: Subject) => (
//                     <SubjectCard
//                       key={subject.name}
//                       name={subject.name}
//                       icon={subject.icon}
//                       completion={subject.completion}
//                       color={subject.color}
//                     />
//                   ))}
//                 </div>
//               </section>
//             )}

//             {activeNav === 'achievements' && (
//                 <div className="py-20 text-center border-2 border-dashed rounded-2xl animate-in zoom-in-95">
//                     <p className="text-muted-foreground">Your detailed achievement history will appear here.</p>
//                 </div>
//             )}
//           </div>

//           {/* Sidebar - Milestones */}
//           <div className="space-y-6">
//             <MilestonesSidebar milestones={milestones} currentPoints={750} />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


'use client' 
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { completeIndividualOnboarding, getIndividualCurricula } from '@/app/actions/individual-onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toTitleCase, formatPhone } from '@/lib/utils/formatters'
import { CheckCircle2, Loader2, ArrowRight, Mail, Check } from 'lucide-react'

type Step = 1 | 2

export default function IndividualStudentOnboardingPage() {
    const router = useRouter()

    const [step, setStep] = useState<Step>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [curricula, setCurricula] = useState<Array<{ id: string; name: string; yearLabel: string; termLabel: string }>>([])
    const [curriculumId, setCurriculumId] = useState<string>('')

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    })

    const canContinue = useMemo(() => {
        return (
            form.name.trim().length > 1 &&
            !!form.email.trim() &&
            form.password.length >= 8
        )
    }, [form.email, form.name, form.password])

    useEffect(() => {
        let mounted = true
        getIndividualCurricula().then((res) => {
            if (!mounted) return
            if (!res.success) {
                toast.error(res.error ?? 'Failed to load curricula.')
                return
            }

            setCurricula(res.data)
            if (res.data.length > 0) {
                setCurriculumId(String(res.data[0].id))
            }
        })

        return () => {
            mounted = false
        }
    }, [])

    async function handleCreate() {
        setError(null)

        if (!curriculumId) {
            setError('Please select a curriculum.')
            return
        }
        if (!canContinue) {
            setError('Please fill in all required fields.')
            return
        }

        setIsLoading(true)
        try {
            const result = await completeIndividualOnboarding({
                name: toTitleCase(form.name),
                email: form.email.trim(),
                password: form.password,
                phone: form.phone.trim() ? formatPhone(form.phone.trim()) : null,
                curriculumId,
            })

            if (!result.success) {
                setError(result.error ?? 'Failed to create account.')
                toast.error(result.error ?? 'Failed to create account.')
                return
            }

            // Sign in immediately so we can redirect to the dashboard.
            const supabase = createClient()
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: form.email.trim(),
                password: form.password,
            })

            if (signInError) {
                toast.error(signInError.message ?? 'Account created, but sign-in failed.')
                router.replace('/login')
                return
            }

            toast.success('Account created! Redirecting...')
            router.replace('/individual-student')
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Something went wrong.'
            setError(msg)
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-school-secondary-950 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
                        <span className="text-school-secondary-950 font-black text-sm">E</span>
                    </div>
                    <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
                </div>
                <p className="text-school-secondary-100/50 text-sm hidden sm:block">
                    Individual learner onboarding
                </p>
            </header>

            <main className="flex-1 flex items-start justify-center px-4 pb-16 pt-8">
                <div className="w-full max-w-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-school-secondary-100 tracking-tight">
                            {step === 1 ? 'Create your account' : 'Choose your curriculum'}
                        </h1>
                        <p className="text-school-secondary-100/50 mt-2 text-sm">
                            {step === 1
                                ? 'Start learning without registering with a school.'
                                : 'Pick a template curriculum to begin.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Full Name
                                </Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="John Doe"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Email Address
                                </Label>
                                <Input
                                    value={form.email}
                                    type="email"
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="learner@example.com"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Password
                                </Label>
                                <Input
                                    value={form.password}
                                    type="password"
                                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                    placeholder="Min. 8 characters"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                                <p className="text-[10px] text-school-secondary-100/30">
                                    Password must be at least 8 characters.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Phone Number <span className="text-school-secondary-100/30">(optional)</span>
                                </Label>
                                <Input
                                    value={form.phone}
                                    type="tel"
                                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    placeholder="+234 800 000 0000"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!canContinue}
                                className="w-full bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 disabled:opacity-40"
                            >
                                Continue to curriculum
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>

                            <p className="text-center text-xs text-school-secondary-100/30">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    className="text-school-primary hover:underline font-semibold"
                                    onClick={() => router.replace('/login')}
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Curriculum Template
                                </Label>
                                <Select value={curriculumId} onValueChange={(v) => setCurriculumId(v)}>
                                    <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                        <SelectValue placeholder="Select curriculum..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                        {curricula.length === 0 ? (
                                            <SelectItem value="loading" disabled>
                                                Loading curricula...
                                            </SelectItem>
                                        ) : (
                                            curricula.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name} ({c.yearLabel}, {c.termLabel})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="rounded-xl p-4 bg-school-secondary-800/40 border border-school-secondary-700/60">
                                <p className="text-sm font-semibold text-school-secondary-100">
                                    What happens next?
                                </p>
                                <ul className="mt-2 space-y-1 text-[13px] text-school-secondary-100/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-school-primary" />
                                        Account created (no school needed)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-school-primary" />
                                        Confirmation link sent to your email
                                    </li>
                                </ul>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    disabled={isLoading}
                                    className="flex-1 border-school-secondary-700 text-school-secondary-100/60 hover:text-school-secondary-100 hover:bg-school-secondary-800"
                                >
                                    Back
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={isLoading || !curriculumId}
                                    className="flex-1 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 disabled:opacity-40"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create account'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

