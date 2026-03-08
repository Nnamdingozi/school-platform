// 'use client'

// import { useState } from 'react'
// import { DashboardHeader } from '@/components/individual-student/dashboard-header'
// import { DashboardNavigation } from '@/components/individual-student/dashboard-navigation'
// import { ContinueLearningCard } from '@/components/individual-student/continue-learning-card'
// import { SubjectCard } from '@/components/individual-student/subject-card'
// import { AIRecommendations } from '@/components/individual-student/ai-recommendations'
// import { MilestonesSidebar } from '@/components/individual-student/milestones-sidebar'

// // Sample data
// const subjects = [
//   { name: 'Math', icon: '🔢', completion: 80, color: 'blue' as const },
//   { name: 'Science', icon: '🧪', completion: 65, color: 'cyan' as const },
//   { name: 'English', icon: '📖', completion: 72, color: 'pink' as const },
//   { name: 'History', icon: '🏛️', completion: 45, color: 'yellow' as const },
//   { name: 'Art', icon: '🎨', completion: 55, color: 'pink' as const },
//   { name: 'Music', icon: '🎵', completion: 38, color: 'blue' as const },
// ]

// const recommendations = [
//   {
//     id: '1',
//     title: 'Quadratic Equations',
//     description: 'Learn how to solve equations with two variables using various methods.',
//     difficulty: 'Intermediate' as const,
//     estimatedTime: '45 minutes',
//   },
//   {
//     id: '2',
//     title: 'Photosynthesis Deep Dive',
//     description: 'Explore the process of photosynthesis and its importance in ecosystems.',
//     difficulty: 'Beginner' as const,
//     estimatedTime: '30 minutes',
//   },
//   {
//     id: '3',
//     title: 'Shakespeare Analysis',
//     description: 'Analyze themes and literary devices in classic Shakespeare works.',
//     difficulty: 'Advanced' as const,
//     estimatedTime: '60 minutes',
//   },
// ]

// const milestones = [
//   {
//     id: '1',
//     level: 1,
//     title: 'Getting Started',
//     icon: '🌟',
//     unlocked: true,
//     pointsRequired: 100,
//   },
//   {
//     id: '2',
//     level: 2,
//     title: 'Rising Scholar',
//     icon: '📚',
//     unlocked: true,
//     pointsRequired: 500,
//   },
//   {
//     id: '3',
//     level: 3,
//     title: 'Knowledge Master',
//     icon: '🧠',
//     unlocked: false,
//     pointsRequired: 1000,
//   },
//   {
//     id: '4',
//     level: 4,
//     title: 'Expert Learner',
//     icon: '🎓',
//     unlocked: false,
//     pointsRequired: 2000,
//   },
// ]

// export default function DashboardPage() {
//   const [_, setActiveNav] = useState('learning-path')

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
//             {/* Continue Learning Section */}
//             <div>
//               <ContinueLearningCard
//                 topic="Fractions & Decimals"
//                 subject="Mathematics"
//                 progress={80}
//                 nextUp="Long Division"
//               />
//             </div>

//             {/* Subject Discovery Grid */}
//             <section>
//               <h2 className="mb-6 text-2xl font-bold text-foreground">Explore Subjects</h2>
//               <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
//                 {subjects.map((subject) => (
//                   <SubjectCard
//                     key={subject.name}
//                     name={subject.name}
//                     icon={subject.icon}
//                     completion={subject.completion}
//                     color={subject.color}
//                   />
//                 ))}
//               </div>
//             </section>

//             {/* AI Recommendations */}
//             <AIRecommendations recommendations={recommendations} />
//           </div>

//           {/* Sidebar - Milestones */}
//           <div>
//             <MilestonesSidebar milestones={milestones} currentPoints={750} />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/individual-student/dashboard-header'
import { DashboardNavigation } from '@/components/individual-student/dashboard-navigation'
import { ContinueLearningCard } from '@/components/individual-student/continue-learning-card'
import { SubjectCard } from '@/components/individual-student/subject-card'
import { AIRecommendations } from '@/components/individual-student/ai-recommendations'
import { MilestonesSidebar } from '@/components/individual-student/milestones-sidebar'

// --- Types to prevent 'any' errors ---
interface Subject {
  name: string;
  icon: string;
  completion: number;
  color: 'blue' | 'cyan' | 'pink' | 'yellow';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

interface Milestone {
  id: string;
  level: number;
  title: string;
  icon: string;
  unlocked: boolean;
  pointsRequired: number;
}

// --- Sample Data ---
const subjects: Subject[] = [
  { name: 'Math', icon: '🔢', completion: 80, color: 'blue' },
  { name: 'Science', icon: '🧪', completion: 65, color: 'cyan' },
  { name: 'English', icon: '📖', completion: 72, color: 'pink' },
  { name: 'History', icon: '🏛️', completion: 45, color: 'yellow' },
  { name: 'Art', icon: '🎨', completion: 55, color: 'pink' },
  { name: 'Music', icon: '🎵', completion: 38, color: 'blue' },
]

const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Quadratic Equations',
    description: 'Learn how to solve equations with two variables using various methods.',
    difficulty: 'Intermediate',
    estimatedTime: '45 minutes',
  },
  {
    id: '2',
    title: 'Photosynthesis Deep Dive',
    description: 'Explore the process of photosynthesis and its importance in ecosystems.',
    difficulty: 'Beginner',
    estimatedTime: '30 minutes',
  },
  {
    id: '3',
    title: 'Shakespeare Analysis',
    description: 'Analyze themes and literary devices in classic Shakespeare works.',
    difficulty: 'Advanced',
    estimatedTime: '60 minutes',
  },
]

const milestones: Milestone[] = [
  { id: '1', level: 1, title: 'Getting Started', icon: '🌟', unlocked: true, pointsRequired: 100 },
  { id: '2', level: 2, title: 'Rising Scholar', icon: '📚', unlocked: true, pointsRequired: 500 },
  { id: '3', level: 3, title: 'Knowledge Master', icon: '🧠', unlocked: false, pointsRequired: 1000 },
  { id: '4', level: 4, title: 'Expert Learner', icon: '🎓', unlocked: false, pointsRequired: 2000 },
]

export default function DashboardPage() {
  // ✅ FIX: Use the state variable to drive the UI
  const [activeNav, setActiveNav] = useState('learning-path')

  const handleNavigation = (id: string) => {
    setActiveNav(id)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader userName="Alex" streak={12} learningPoints={750} />

      {/* Navigation */}
      <DashboardNavigation onNavigate={handleNavigation} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Show specific content based on activeNav */}
            {activeNav === 'learning-path' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ContinueLearningCard
                  topic="Fractions & Decimals"
                  subject="Mathematics"
                  progress={80}
                  nextUp="Long Division"
                />
                
                <AIRecommendations recommendations={recommendations} />
              </div>
            )}

            {/* Always show subjects or show only when tab selected */}
            {(activeNav === 'learning-path' || activeNav === 'subjects') && (
              <section className="animate-in fade-in duration-500">
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  {activeNav === 'subjects' ? 'All Subjects' : 'Explore Subjects'}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                  {subjects.map((subject: Subject) => (
                    <SubjectCard
                      key={subject.name}
                      name={subject.name}
                      icon={subject.icon}
                      completion={subject.completion}
                      color={subject.color}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeNav === 'achievements' && (
                <div className="py-20 text-center border-2 border-dashed rounded-2xl animate-in zoom-in-95">
                    <p className="text-muted-foreground">Your detailed achievement history will appear here.</p>
                </div>
            )}
          </div>

          {/* Sidebar - Milestones */}
          <div className="space-y-6">
            <MilestonesSidebar milestones={milestones} currentPoints={750} />
          </div>
        </div>
      </main>
    </div>
  )
}