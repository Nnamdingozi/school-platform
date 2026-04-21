// "use client";

// import React from "react"

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   Calculator,
//   BookOpen,
//   FlaskConical,
//   Globe,
//   Palette,
//   Music,
//   Dumbbell,
//   Languages,
//   History,
//   Laptop,
//   CheckCircle2,
//   Circle,
//   PlayCircle,
//   ArrowLeft,
//   Clock,
//   User,
//   BookMarked,
//   ChevronRight,
// } from "lucide-react";

// interface Topic {
//   id: string;
//   name: string;
//   status: "completed" | "current" | "upcoming";
// }

// interface TermData {
//   term: 1 | 2 | 3;
//   topics: Topic[];
//   grade: string;
// }

// interface Subject {
//   id: string;
//   name: string;
//   teacher: string;
//   icon: React.ReactNode;
//   color: string;
//   terms: TermData[];
//   nextClass: string;
//   isLive: boolean;
// }

// const subjects: Subject[] = [
//   {
//     id: "math",
//     name: "Mathematics",
//     teacher: "Mr. Okonkwo",
//     icon: <Calculator className="h-5 w-5" />,
//     color: "bg-blue-500",
//     nextClass: "Live Now",
//     isLive: true,
//     terms: [
//       {
//         term: 1,
//         grade: "A",
//         topics: [
//           { id: "1", name: "Number Systems", status: "completed" },
//           { id: "2", name: "Whole Numbers", status: "completed" },
//           { id: "3", name: "Factors & Multiples", status: "completed" },
//           { id: "4", name: "Fractions", status: "current" },
//           { id: "5", name: "Decimals", status: "upcoming" },
//           { id: "6", name: "Percentages", status: "upcoming" },
//           { id: "7", name: "Ratio & Proportion", status: "upcoming" },
//           { id: "8", name: "Basic Algebra", status: "upcoming" },
//           { id: "9", name: "Linear Equations", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Geometry Basics", status: "upcoming" },
//           { id: "2", name: "Angles", status: "upcoming" },
//           { id: "3", name: "Triangles", status: "upcoming" },
//           { id: "4", name: "Quadrilaterals", status: "upcoming" },
//           { id: "5", name: "Circles", status: "upcoming" },
//           { id: "6", name: "Perimeter", status: "upcoming" },
//           { id: "7", name: "Area", status: "upcoming" },
//           { id: "8", name: "Volume", status: "upcoming" },
//           { id: "9", name: "Coordinate Geometry", status: "upcoming" },
//           { id: "10", name: "Transformations", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Statistics", status: "upcoming" },
//           { id: "2", name: "Data Collection", status: "upcoming" },
//           { id: "3", name: "Mean, Median, Mode", status: "upcoming" },
//           { id: "4", name: "Probability", status: "upcoming" },
//           { id: "5", name: "Graphs & Charts", status: "upcoming" },
//           { id: "6", name: "Sets", status: "upcoming" },
//           { id: "7", name: "Venn Diagrams", status: "upcoming" },
//           { id: "8", name: "Word Problems", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "english",
//     name: "English Language",
//     teacher: "Mrs. Adebayo",
//     icon: <BookOpen className="h-5 w-5" />,
//     color: "bg-emerald-500",
//     nextClass: "Today, 11:30 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "A-",
//         topics: [
//           { id: "1", name: "Parts of Speech", status: "completed" },
//           { id: "2", name: "Nouns & Pronouns", status: "completed" },
//           { id: "3", name: "Verbs & Tenses", status: "completed" },
//           { id: "4", name: "Adjectives & Adverbs", status: "completed" },
//           { id: "5", name: "Sentence Structure", status: "completed" },
//           { id: "6", name: "Comprehension", status: "current" },
//           { id: "7", name: "Essay Writing", status: "upcoming" },
//           { id: "8", name: "Letter Writing", status: "upcoming" },
//           { id: "9", name: "Story Writing", status: "upcoming" },
//           { id: "10", name: "Speech & Oral", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Vocabulary Building", status: "upcoming" },
//           { id: "2", name: "Synonyms & Antonyms", status: "upcoming" },
//           { id: "3", name: "Idioms & Proverbs", status: "upcoming" },
//           { id: "4", name: "Figures of Speech", status: "upcoming" },
//           { id: "5", name: "Punctuation", status: "upcoming" },
//           { id: "6", name: "Direct & Indirect Speech", status: "upcoming" },
//           { id: "7", name: "Active & Passive Voice", status: "upcoming" },
//           { id: "8", name: "Summary Writing", status: "upcoming" },
//           { id: "9", name: "Debate Skills", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Literature: Prose", status: "upcoming" },
//           { id: "2", name: "Literature: Poetry", status: "upcoming" },
//           { id: "3", name: "Literature: Drama", status: "upcoming" },
//           { id: "4", name: "Critical Analysis", status: "upcoming" },
//           { id: "5", name: "Report Writing", status: "upcoming" },
//           { id: "6", name: "Formal Writing", status: "upcoming" },
//           { id: "7", name: "Creative Writing", status: "upcoming" },
//           { id: "8", name: "Revision", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "science",
//     name: "Basic Science",
//     teacher: "Dr. Nnamdi",
//     icon: <FlaskConical className="h-5 w-5" />,
//     color: "bg-amber-500",
//     nextClass: "Today, 2:00 PM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "B+",
//         topics: [
//           { id: "1", name: "Living Things", status: "completed" },
//           { id: "2", name: "Classification of Living Things", status: "completed" },
//           { id: "3", name: "The Cell", status: "completed" },
//           { id: "4", name: "States of Matter", status: "current" },
//           { id: "5", name: "Changes in Matter", status: "upcoming" },
//           { id: "6", name: "Elements & Compounds", status: "upcoming" },
//           { id: "7", name: "Mixtures & Solutions", status: "upcoming" },
//           { id: "8", name: "Separation Techniques", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Energy Forms", status: "upcoming" },
//           { id: "2", name: "Heat Transfer", status: "upcoming" },
//           { id: "3", name: "Light & Reflection", status: "upcoming" },
//           { id: "4", name: "Sound Waves", status: "upcoming" },
//           { id: "5", name: "Electricity Basics", status: "upcoming" },
//           { id: "6", name: "Simple Circuits", status: "upcoming" },
//           { id: "7", name: "Magnetism", status: "upcoming" },
//           { id: "8", name: "Force & Motion", status: "upcoming" },
//           { id: "9", name: "Simple Machines", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "The Human Body", status: "upcoming" },
//           { id: "2", name: "Digestive System", status: "upcoming" },
//           { id: "3", name: "Respiratory System", status: "upcoming" },
//           { id: "4", name: "Circulatory System", status: "upcoming" },
//           { id: "5", name: "Plants & Photosynthesis", status: "upcoming" },
//           { id: "6", name: "Ecology", status: "upcoming" },
//           { id: "7", name: "Weather & Climate", status: "upcoming" },
//           { id: "8", name: "Environmental Science", status: "upcoming" },
//           { id: "9", name: "Earth & Space", status: "upcoming" },
//           { id: "10", name: "Scientific Method", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "social",
//     name: "Social Studies",
//     teacher: "Mrs. Eze",
//     icon: <Globe className="h-5 w-5" />,
//     color: "bg-rose-500",
//     nextClass: "Tomorrow, 9:00 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "A",
//         topics: [
//           { id: "1", name: "Family & Community", status: "completed" },
//           { id: "2", name: "Nigerian Culture", status: "completed" },
//           { id: "3", name: "Ethnic Groups", status: "completed" },
//           { id: "4", name: "National Symbols", status: "completed" },
//           { id: "5", name: "Nigerian Government", status: "completed" },
//           { id: "6", name: "Citizenship", status: "completed" },
//           { id: "7", name: "Rights & Duties", status: "current" },
//           { id: "8", name: "Leadership Qualities", status: "upcoming" },
//           { id: "9", name: "Democracy", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Nigerian Geography", status: "upcoming" },
//           { id: "2", name: "Map Reading", status: "upcoming" },
//           { id: "3", name: "Natural Resources", status: "upcoming" },
//           { id: "4", name: "Agriculture in Nigeria", status: "upcoming" },
//           { id: "5", name: "Industries", status: "upcoming" },
//           { id: "6", name: "Transportation", status: "upcoming" },
//           { id: "7", name: "Communication", status: "upcoming" },
//           { id: "8", name: "Trade & Commerce", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "African History", status: "upcoming" },
//           { id: "2", name: "Pre-Colonial Nigeria", status: "upcoming" },
//           { id: "3", name: "Colonial Era", status: "upcoming" },
//           { id: "4", name: "Independence", status: "upcoming" },
//           { id: "5", name: "Nigeria Today", status: "upcoming" },
//           { id: "6", name: "International Relations", status: "upcoming" },
//           { id: "7", name: "Global Issues", status: "upcoming" },
//           { id: "8", name: "Peace & Conflict", status: "upcoming" },
//           { id: "9", name: "Sustainable Development", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "art",
//     name: "Fine Arts",
//     teacher: "Mr. Yakubu",
//     icon: <Palette className="h-5 w-5" />,
//     color: "bg-pink-500",
//     nextClass: "Tomorrow, 11:00 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "A+",
//         topics: [
//           { id: "1", name: "Introduction to Art", status: "completed" },
//           { id: "2", name: "Art Materials", status: "completed" },
//           { id: "3", name: "Drawing Basics", status: "completed" },
//           { id: "4", name: "Lines & Shapes", status: "completed" },
//           { id: "5", name: "Color Theory", status: "completed" },
//           { id: "6", name: "Color Mixing", status: "completed" },
//           { id: "7", name: "Still Life Drawing", status: "completed" },
//           { id: "8", name: "Shading Techniques", status: "current" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Painting Basics", status: "upcoming" },
//           { id: "2", name: "Watercolor Techniques", status: "upcoming" },
//           { id: "3", name: "Landscape Art", status: "upcoming" },
//           { id: "4", name: "Portrait Drawing", status: "upcoming" },
//           { id: "5", name: "Nigerian Art History", status: "upcoming" },
//           { id: "6", name: "Traditional Art Forms", status: "upcoming" },
//           { id: "7", name: "Textile Design", status: "upcoming" },
//           { id: "8", name: "Pattern Making", status: "upcoming" },
//           { id: "9", name: "Craft Work", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "3D Art Forms", status: "upcoming" },
//           { id: "2", name: "Clay Modeling", status: "upcoming" },
//           { id: "3", name: "Paper Craft", status: "upcoming" },
//           { id: "4", name: "Collage Making", status: "upcoming" },
//           { id: "5", name: "Digital Art Intro", status: "upcoming" },
//           { id: "6", name: "Art Appreciation", status: "upcoming" },
//           { id: "7", name: "Art Exhibition", status: "upcoming" },
//           { id: "8", name: "Portfolio Development", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "music",
//     name: "Music",
//     teacher: "Mrs. Obi",
//     icon: <Music className="h-5 w-5" />,
//     color: "bg-violet-500",
//     nextClass: "Wed, 10:00 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "B+",
//         topics: [
//           { id: "1", name: "Introduction to Music", status: "completed" },
//           { id: "2", name: "Musical Notes", status: "completed" },
//           { id: "3", name: "Rhythm Basics", status: "completed" },
//           { id: "4", name: "Tempo & Dynamics", status: "completed" },
//           { id: "5", name: "Traditional Instruments", status: "current" },
//           { id: "6", name: "Nigerian Folk Songs", status: "upcoming" },
//           { id: "7", name: "Singing Techniques", status: "upcoming" },
//           { id: "8", name: "Music Appreciation", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Western Instruments", status: "upcoming" },
//           { id: "2", name: "Recorder Playing", status: "upcoming" },
//           { id: "3", name: "Keyboard Basics", status: "upcoming" },
//           { id: "4", name: "Music Theory", status: "upcoming" },
//           { id: "5", name: "Scales & Chords", status: "upcoming" },
//           { id: "6", name: "Reading Music", status: "upcoming" },
//           { id: "7", name: "Ensemble Playing", status: "upcoming" },
//           { id: "8", name: "Music Composition", status: "upcoming" },
//           { id: "9", name: "Song Writing", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Music Genres", status: "upcoming" },
//           { id: "2", name: "African Music", status: "upcoming" },
//           { id: "3", name: "World Music", status: "upcoming" },
//           { id: "4", name: "Music & Technology", status: "upcoming" },
//           { id: "5", name: "Concert Preparation", status: "upcoming" },
//           { id: "6", name: "Performance Skills", status: "upcoming" },
//           { id: "7", name: "Music History", status: "upcoming" },
//           { id: "8", name: "End of Year Concert", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "pe",
//     name: "Physical Education",
//     teacher: "Coach Emeka",
//     icon: <Dumbbell className="h-5 w-5" />,
//     color: "bg-orange-500",
//     nextClass: "Wed, 2:00 PM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "A",
//         topics: [
//           { id: "1", name: "Physical Fitness", status: "completed" },
//           { id: "2", name: "Warm-up Exercises", status: "completed" },
//           { id: "3", name: "Basic Gymnastics", status: "completed" },
//           { id: "4", name: "Track Events", status: "completed" },
//           { id: "5", name: "Running Techniques", status: "completed" },
//           { id: "6", name: "Jumping Events", status: "completed" },
//           { id: "7", name: "Throwing Events", status: "current" },
//           { id: "8", name: "Athletics Competition", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Football Basics", status: "upcoming" },
//           { id: "2", name: "Football Skills", status: "upcoming" },
//           { id: "3", name: "Basketball Basics", status: "upcoming" },
//           { id: "4", name: "Volleyball", status: "upcoming" },
//           { id: "5", name: "Table Tennis", status: "upcoming" },
//           { id: "6", name: "Badminton", status: "upcoming" },
//           { id: "7", name: "Team Sports", status: "upcoming" },
//           { id: "8", name: "Sportsmanship", status: "upcoming" },
//           { id: "9", name: "Inter-House Sports", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Swimming Basics", status: "upcoming" },
//           { id: "2", name: "Water Safety", status: "upcoming" },
//           { id: "3", name: "Health Education", status: "upcoming" },
//           { id: "4", name: "Nutrition", status: "upcoming" },
//           { id: "5", name: "First Aid", status: "upcoming" },
//           { id: "6", name: "Personal Hygiene", status: "upcoming" },
//           { id: "7", name: "Fitness Assessment", status: "upcoming" },
//           { id: "8", name: "Sports Day", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "french",
//     name: "French",
//     teacher: "Mme. Chioma",
//     icon: <Languages className="h-5 w-5" />,
//     color: "bg-sky-500",
//     nextClass: "Thu, 9:00 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "B",
//         topics: [
//           { id: "1", name: "French Alphabet", status: "completed" },
//           { id: "2", name: "Basic Greetings", status: "completed" },
//           { id: "3", name: "Introducing Yourself", status: "completed" },
//           { id: "4", name: "Numbers 1-100", status: "current" },
//           { id: "5", name: "Days & Months", status: "upcoming" },
//           { id: "6", name: "Colors", status: "upcoming" },
//           { id: "7", name: "Family Members", status: "upcoming" },
//           { id: "8", name: "Common Objects", status: "upcoming" },
//           { id: "9", name: "Basic Conversations", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Articles & Gender", status: "upcoming" },
//           { id: "2", name: "Plural Forms", status: "upcoming" },
//           { id: "3", name: "Common Verbs", status: "upcoming" },
//           { id: "4", name: "Present Tense", status: "upcoming" },
//           { id: "5", name: "Asking Questions", status: "upcoming" },
//           { id: "6", name: "Food & Drinks", status: "upcoming" },
//           { id: "7", name: "At the Restaurant", status: "upcoming" },
//           { id: "8", name: "Shopping Vocabulary", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "House & Home", status: "upcoming" },
//           { id: "2", name: "School Vocabulary", status: "upcoming" },
//           { id: "3", name: "Hobbies & Sports", status: "upcoming" },
//           { id: "4", name: "Weather Expressions", status: "upcoming" },
//           { id: "5", name: "Telling Time", status: "upcoming" },
//           { id: "6", name: "Daily Routine", status: "upcoming" },
//           { id: "7", name: "French Culture", status: "upcoming" },
//           { id: "8", name: "French Songs", status: "upcoming" },
//           { id: "9", name: "Oral Presentation", status: "upcoming" },
//           { id: "10", name: "Year Review", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "history",
//     name: "History",
//     teacher: "Mr. Bello",
//     icon: <History className="h-5 w-5" />,
//     color: "bg-stone-500",
//     nextClass: "Thu, 11:30 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "A-",
//         topics: [
//           { id: "1", name: "What is History?", status: "completed" },
//           { id: "2", name: "Sources of History", status: "completed" },
//           { id: "3", name: "Archaeology", status: "completed" },
//           { id: "4", name: "Early Man in Africa", status: "completed" },
//           { id: "5", name: "Ancient Civilizations", status: "completed" },
//           { id: "6", name: "Pre-Colonial Nigeria", status: "current" },
//           { id: "7", name: "Nigerian Kingdoms", status: "upcoming" },
//           { id: "8", name: "Trade Routes", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "European Contact", status: "upcoming" },
//           { id: "2", name: "The Slave Trade", status: "upcoming" },
//           { id: "3", name: "Abolition Movement", status: "upcoming" },
//           { id: "4", name: "Colonization", status: "upcoming" },
//           { id: "5", name: "Colonial Administration", status: "upcoming" },
//           { id: "6", name: "Indirect Rule", status: "upcoming" },
//           { id: "7", name: "Resistance Movements", status: "upcoming" },
//           { id: "8", name: "World Wars Impact", status: "upcoming" },
//           { id: "9", name: "Nationalism", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Road to Independence", status: "upcoming" },
//           { id: "2", name: "Nigerian Independence", status: "upcoming" },
//           { id: "3", name: "First Republic", status: "upcoming" },
//           { id: "4", name: "Military Rule", status: "upcoming" },
//           { id: "5", name: "Civil War", status: "upcoming" },
//           { id: "6", name: "Return to Democracy", status: "upcoming" },
//           { id: "7", name: "Modern Nigeria", status: "upcoming" },
//           { id: "8", name: "Nigerian Heroes", status: "upcoming" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "ict",
//     name: "Computer Studies",
//     teacher: "Mr. Ajayi",
//     icon: <Laptop className="h-5 w-5" />,
//     color: "bg-cyan-500",
//     nextClass: "Fri, 10:00 AM",
//     isLive: false,
//     terms: [
//       {
//         term: 1,
//         grade: "A",
//         topics: [
//           { id: "1", name: "Introduction to Computers", status: "completed" },
//           { id: "2", name: "Computer Hardware", status: "completed" },
//           { id: "3", name: "Computer Software", status: "completed" },
//           { id: "4", name: "Operating Systems", status: "completed" },
//           { id: "5", name: "File Management", status: "completed" },
//           { id: "6", name: "Keyboard Skills", status: "current" },
//           { id: "7", name: "Word Processing", status: "upcoming" },
//           { id: "8", name: "Document Formatting", status: "upcoming" },
//           { id: "9", name: "Typing Practice", status: "upcoming" },
//         ],
//       },
//       {
//         term: 2,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Spreadsheets Intro", status: "upcoming" },
//           { id: "2", name: "Data Entry", status: "upcoming" },
//           { id: "3", name: "Basic Formulas", status: "upcoming" },
//           { id: "4", name: "Charts & Graphs", status: "upcoming" },
//           { id: "5", name: "Presentation Software", status: "upcoming" },
//           { id: "6", name: "Creating Slides", status: "upcoming" },
//           { id: "7", name: "Animations", status: "upcoming" },
//           { id: "8", name: "Multimedia Basics", status: "upcoming" },
//         ],
//       },
//       {
//         term: 3,
//         grade: "-",
//         topics: [
//           { id: "1", name: "Internet Basics", status: "upcoming" },
//           { id: "2", name: "Web Browsers", status: "upcoming" },
//           { id: "3", name: "Online Safety", status: "upcoming" },
//           { id: "4", name: "Email Communication", status: "upcoming" },
//           { id: "5", name: "Search Skills", status: "upcoming" },
//           { id: "6", name: "Coding Introduction", status: "upcoming" },
//           { id: "7", name: "Scratch Programming", status: "upcoming" },
//           { id: "8", name: "Digital Citizenship", status: "upcoming" },
//           { id: "9", name: "Project Work", status: "upcoming" },
//         ],
//       },
//     ],
//   },
// ];

// function getGradeColor(grade: string): string {
//   if (grade === "-") return "bg-muted text-muted-foreground";
//   if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700";
//   if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
//   if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
//   if (grade.startsWith("D")) return "bg-orange-100 text-orange-700";
//   return "bg-red-100 text-red-700";
// }

// function getStatusIcon(status: Topic["status"]) {
//   switch (status) {
//     case "completed":
//       return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
//     case "current":
//       return <PlayCircle className="h-4 w-4 text-primary" />;
//     case "upcoming":
//       return <Circle className="h-4 w-4 text-muted-foreground" />;
//   }
// }

// function getYearProgress(subject: Subject): { completed: number; total: number } {
//   let completed = 0;
//   let total = 0;
//   for (const term of subject.terms) {
//     for (const topic of term.topics) {
//       total++;
//       if (topic.status === "completed") completed++;
//     }
//   }
//   return { completed, total };
// }

// function getCurrentTopic(subject: Subject): Topic | null {
//   for (const term of subject.terms) {
//     const current = term.topics.find((t) => t.status === "current");
//     if (current) return current;
//   }
//   return null;
// }

// // Subject Card Component
// function SubjectCard({
//   subject,
//   onSelect,
// }: {
//   subject: Subject;
//   onSelect: () => void;
// }) {
//   const yearProgress = getYearProgress(subject);
//   const currentTopic = getCurrentTopic(subject);
//   const progressPercent = (yearProgress.completed / yearProgress.total) * 100;

//   return (
//     <Card
//       className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
//       onClick={onSelect}
//     >
//       <CardContent className="p-4">
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-center gap-3">
//             <div
//               className={`${subject.color} p-2.5 rounded-lg text-white shadow-sm`}
//             >
//               {subject.icon}
//             </div>
//             <div>
//               <h3 className="font-semibold text-foreground leading-tight">
//                 {subject.name}
//               </h3>
//               <p className="text-xs text-muted-foreground">{subject.teacher}</p>
//             </div>
//           </div>
//           <Badge className={`${getGradeColor(subject.terms[0].grade)} text-xs`}>
//             {subject.terms[0].grade}
//           </Badge>
//         </div>

//         {/* Year Progress */}
//         <div className="mb-3">
//           <div className="flex justify-between items-center text-xs mb-1">
//             <span className="text-muted-foreground">Year Progress</span>
//             <span className="font-medium">
//               {yearProgress.completed}/{yearProgress.total} topics
//             </span>
//           </div>
//           <Progress value={progressPercent} className="h-1.5" />
//         </div>

//         {/* Current Topic */}
//         {currentTopic && (
//           <div className="bg-primary/5 rounded-lg p-2 mb-3">
//             <div className="flex items-center gap-2">
//               <PlayCircle className="h-3.5 w-3.5 text-primary" />
//               <span className="text-xs font-medium text-primary">
//                 {currentTopic.name}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Next Class */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//             <Clock className="h-3.5 w-3.5" />
//             {subject.isLive ? (
//               <span className="flex items-center gap-1">
//                 <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//                 <span className="text-emerald-600 font-medium">Live Now</span>
//               </span>
//             ) : (
//               <span>{subject.nextClass}</span>
//             )}
//           </div>
//           <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // Curriculum View Component
// function CurriculumView({
//   subject,
//   onBack,
// }: {
//   subject: Subject;
//   onBack: () => void;
// }) {
//   const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(1);
//   const yearProgress = getYearProgress(subject);
//   const termData = subject.terms.find((t) => t.term === selectedTerm)!;
//   const termCompleted = termData.topics.filter(
//     (t) => t.status === "completed"
//   ).length;
//   const termProgress = (termCompleted / termData.topics.length) * 100;

//   return (
//     <Card className="border-0 shadow-none">
//       <CardHeader className="pb-4">
//         <div className="flex items-center gap-3 mb-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onBack}
//             className="h-8 w-8"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div className={`${subject.color} p-3 rounded-xl text-white shadow-sm`}>
//             {subject.icon}
//           </div>
//           <div className="flex-1">
//             <CardTitle className="text-xl">{subject.name}</CardTitle>
//             <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
//               <span className="flex items-center gap-1">
//                 <User className="h-3.5 w-3.5" />
//                 {subject.teacher}
//               </span>
//               <span className="flex items-center gap-1">
//                 <BookMarked className="h-3.5 w-3.5" />
//                 {yearProgress.total} topics
//               </span>
//             </div>
//           </div>
//           {subject.isLive && (
//             <Button className="bg-emerald-600 hover:bg-emerald-700">
//               Join Live Class
//             </Button>
//           )}
//         </div>

//         {/* Year Overview */}
//         <div className="bg-muted/50 rounded-xl p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium">Academic Year Progress</span>
//             <span className="text-sm text-muted-foreground">
//               {yearProgress.completed} of {yearProgress.total} topics completed
//             </span>
//           </div>
//           <Progress
//             value={(yearProgress.completed / yearProgress.total) * 100}
//             className="h-2 mb-3"
//           />
//           <div className="grid grid-cols-3 gap-3">
//             {subject.terms.map((term) => {
//               const completed = term.topics.filter(
//                 (t) => t.status === "completed"
//               ).length;
//               const hasCurrent = term.topics.some((t) => t.status === "current");
//               return (
//                 <button
//                   key={term.term}
//                   onClick={() => setSelectedTerm(term.term)}
//                   className={`p-3 rounded-lg text-left transition-all ${
//                     selectedTerm === term.term
//                       ? "bg-card shadow-sm border border-primary/20"
//                       : "hover:bg-card/50"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-1">
//                     <span className="text-sm font-medium">Term {term.term}</span>
//                     {hasCurrent && (
//                       <Badge
//                         variant="secondary"
//                         className="text-[10px] bg-primary/10 text-primary"
//                       >
//                         Current
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="text-xs text-muted-foreground mb-1">
//                     {completed}/{term.topics.length} topics
//                   </div>
//                   <Badge className={`${getGradeColor(term.grade)} text-xs`}>
//                     Grade: {term.grade}
//                   </Badge>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent>
//         {/* Term Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h3 className="font-semibold text-lg">Term {selectedTerm} Curriculum</h3>
//             <p className="text-sm text-muted-foreground">
//               {termData.topics.length} topics - {termCompleted} completed
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold">{Math.round(termProgress)}%</div>
//             <div className="text-xs text-muted-foreground">Complete</div>
//           </div>
//         </div>

//         {/* Topics List */}
//         <div className="space-y-2">
//           {termData.topics.map((topic, index) => (
//             <div
//               key={topic.id}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                 topic.status === "current"
//                   ? "bg-primary/5 border border-primary/20"
//                   : topic.status === "completed"
//                     ? "bg-muted/30"
//                     : "hover:bg-muted/50"
//               }`}
//             >
//               <div className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
//                 {index + 1}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <span
//                     className={`font-medium ${topic.status === "upcoming" ? "text-muted-foreground" : ""}`}
//                   >
//                     {topic.name}
//                   </span>
//                   {topic.status === "current" && (
//                     <Badge
//                       variant="secondary"
//                       className="bg-primary/10 text-primary text-xs"
//                     >
//                       In Progress
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//               {getStatusIcon(topic.status)}
//               {topic.status !== "upcoming" && (
//                 <Button variant="ghost" size="sm" className="h-7 text-xs">
//                   {topic.status === "current" ? "Continue" : "Review"}
//                 </Button>
//               )}
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export function SubjectsGrid() {
//   const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">My Subjects</h2>
//           <p className="text-sm text-muted-foreground">
//             Select a subject to view full curriculum
//           </p>
//         </div>
//         <Badge variant="outline" className="text-xs">
//           {subjects.length} Subjects
//         </Badge>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {subjects.map((subject) => (
//           <SubjectCard
//             key={subject.id}
//             subject={subject}
//             onSelect={() => setSelectedSubject(subject)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   BookOpen, CheckCircle2, ArrowLeft, 
//   User, ChevronRight, BookX, Star
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// // This helper matches your server logic to show badges in SSS
// function isNigerianCore(name: string) {
//   const core = ['english', 'mathematics', 'maths', 'civic', 'social', 'economics', 'biology'];
//   return core.some(kw => name.toLowerCase().includes(kw));
// }

// interface SubjectsGridProps {
//   subjects: any[];
//   classTeacherName: string;
//   gradeLevel: number;
// }

// export function SubjectsGrid({ subjects, classTeacherName, gradeLevel }: SubjectsGridProps) {
//   const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         classTeacherName={classTeacherName}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
//             {gradeLevel <= 9 ? "Full Curriculum" : "My Academic Load"}
//           </h2>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//             {gradeLevel <= 9 
//                 ? "Standard JSS syllabus automatically allocated" 
//                 : "Core subjects and selected electives"}
//           </p>
//         </div>
//         <Badge variant="outline" className="border-white/10 text-school-primary px-4 rounded-full font-black text-[10px] uppercase">
//           {subjects.length} Modules
//         </Badge>
//       </div>

//       {subjects.length === 0 ? (
//         <div className="py-20 text-center bg-slate-900/40 rounded-[2rem] border border-dashed border-white/5">
//             <BookX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//             <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No subjects found for this grade level</p>
//         </div>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {subjects.map((gs) => (
//             <SubjectCard
//               key={gs.id}
//               gs={gs}
//               classTeacherName={classTeacherName}
//               isSSS={gradeLevel >= 10}
//               onSelect={() => setSelectedSubject(gs)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function SubjectCard({ gs, classTeacherName, isSSS, onSelect }: any) {
//   const totalTopics = gs.topics?.length || 0;
//   const gradedTopics = gs.assessments?.length || 0;
//   const progressPercent = totalTopics > 0 ? (gradedTopics / totalTopics) * 100 : 0;
//   const isCore = isSSS && isNigerianCore(gs.subject.name);

//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer bg-slate-900 border-white/5 rounded-[2rem] transition-all hover:border-school-primary/30 shadow-xl overflow-hidden",
//         isCore && "border-school-primary/20 bg-school-primary/[0.02]"
//       )}
//       onClick={onSelect}
//     >
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className={cn(
//                 "p-3 rounded-xl",
//                 isCore ? "bg-school-primary text-slate-950" : "bg-school-primary/10 text-school-primary"
//             )}>
//               <BookOpen className="h-5 w-5" />
//             </div>
//             <div className="min-w-0">
//               <h3 className="font-black text-white uppercase italic tracking-tighter leading-none truncate">
//                 {gs.subject.name}
//               </h3>
//               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 truncate">
//                 {classTeacherName}
//               </p>
//             </div>
//           </div>
//           {isCore && (
//             <Badge className="bg-school-primary text-slate-950 text-[8px] font-black uppercase px-2 py-0">
//               Core
//             </Badge>
//           )}
//         </div>

//         <div className="mb-6 space-y-2">
//           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Coverage</span>
//             <span className="text-slate-300">{gradedTopics}/{totalTopics}</span>
//           </div>
//           <Progress value={progressPercent} className="h-1 bg-slate-950 [&>div]:bg-school-primary" />
//         </div>

//         <div className="flex items-center justify-between pt-4 border-t border-white/5">
//           <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">Open Syllabus</p>
//           <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ── CURRICULUM VIEW (Rest of component remains similar, just use gs data) ──
// function CurriculumView({ subject: gs, classTeacherName, onBack }: any) {
//     const [selectedTerm, setSelectedTerm] = useState<number>(1);
    
//     const terms = useMemo(() => {
//         const map: Record<number, any[]> = { 1: [], 2: [], 3: [] };
//         gs.topics?.forEach((t: any) => {
//             const idx = t.term?.index || 1;
//             if (map[idx]) map[idx].push(t);
//         });
//         return map;
//     }, [gs.topics]);

//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
//             <CardHeader className="bg-slate-950/50 p-8 border-b border-white/5">
//                 <div className="flex items-center gap-4 mb-8">
//                     <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 rounded-xl hover:bg-white/5">
//                         <ArrowLeft className="h-5 w-5 text-slate-400" />
//                     </Button>
//                     <div className="flex-1">
//                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                             {gs.subject.name}
//                         </h2>
//                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
//                             <User className="h-3 w-3 text-school-primary" /> Instructor: {classTeacherName}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                     {[1, 2, 3].map((idx) => (
//                         <button key={idx} onClick={() => setSelectedTerm(idx)} className={cn("p-4 rounded-2xl border text-left transition-all", selectedTerm === idx ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10")}>
//                             <p className="text-[9px] font-black uppercase tracking-[0.2em]">Term</p>
//                             <p className="text-lg font-black italic">0{idx}</p>
//                         </button>
//                     ))}
//                 </div>
//             </CardHeader>
//             <div className="p-8 space-y-3">
//                 {terms[selectedTerm]?.length === 0 ? (
//                     <p className="text-center py-10 text-slate-700 text-[10px] font-bold uppercase italic">No roadmap defined for this term</p>
//                 ) : (
//                     terms[selectedTerm].map((topic: any, index: number) => (
//                         <div key={topic.id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 group">
//                             <div className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">{topic.weekNumber || index + 1}</div>
//                             <div className="flex-1"><p className="text-sm font-black text-slate-200 uppercase tracking-tight italic">{topic.title}</p></div>
//                             <CheckCircle2 className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-colors" />
//                         </div>
//                     ))
//                 )}
//             </div>
//         </Card>
//     );
// }


// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   BookOpen, CheckCircle2, ArrowLeft, 
//   User, ChevronRight, BookX, Star
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";


// // This helper matches your server logic to show badges in SSS
// function isNigerianCore(name: string) {
//   const core = ['english', 'mathematics', 'maths', 'civic', 'social', 'economics', 'biology'];
//   return core.some(kw => name.toLowerCase().includes(kw));
// }

// interface SubjectsGridProps {
//   subjects: any[];
//   classTeacherName: string;
//   gradeLevel: number;
// }

// export function SubjectsGrid({ subjects, classTeacherName, gradeLevel }: SubjectsGridProps) {
//   const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         classTeacherName={classTeacherName}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
//             {gradeLevel <= 9 ? "Full Curriculum" : "My Academic Load"}
//           </h2>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//             {gradeLevel <= 9 
//                 ? "Standard JSS syllabus automatically allocated" 
//                 : "Core subjects and selected electives"}
//           </p>
//         </div>
//         <Badge variant="outline" className="border-white/10 text-school-primary px-4 rounded-full font-black text-[10px] uppercase">
//           {subjects.length} Modules
//         </Badge>
//       </div>

//       {subjects.length === 0 ? (
//         <div className="py-20 text-center bg-slate-900/40 rounded-[2rem] border border-dashed border-white/5">
//             <BookX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//             <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No subjects found for this grade level</p>
//         </div>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {subjects.map((gs) => (
//             <SubjectCard
//               key={gs.id}
//               gs={gs}
//               classTeacherName={classTeacherName}
//               isSSS={gradeLevel >= 10}
//               onSelect={() => setSelectedSubject(gs)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function SubjectCard({ gs, classTeacherName, isSSS, onSelect }: any) {
//   const totalTopics = gs.topics?.length || 0;
//   const gradedTopics = gs.assessments?.length || 0;
//   const progressPercent = totalTopics > 0 ? (gradedTopics / totalTopics) * 100 : 0;
//   const { isCompulsory, stream } = classifyNigerianSubject(
//     gs.subject.name,
//     !isSSS // JSS = true when NOT SSS
//   );
  
//   const isCore = isSSS && isCompulsory;

//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer bg-slate-900 border-white/5 rounded-[2rem] transition-all hover:border-school-primary/30 shadow-xl overflow-hidden",
//         isCore && "border-school-primary/20 bg-school-primary/[0.02]"
//       )}
//       onClick={onSelect}
//     >
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className={cn(
//                 "p-3 rounded-xl",
//                 isCore ? "bg-school-primary text-slate-950" : "bg-school-primary/10 text-school-primary"
//             )}>
//               <BookOpen className="h-5 w-5" />
//             </div>
//             <div className="min-w-0">
//               <h3 className="font-black text-white uppercase italic tracking-tighter leading-none truncate">
//                 {gs.subject.name}
//               </h3>
//               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 truncate">
//                 {classTeacherName}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-1">
//   {isCore && (
//     <Badge className="bg-school-primary text-slate-950 text-[8px] font-black uppercase px-2 py-0">
//       Core
//     </Badge>
//   )}
//   {stream && !isCore && (
//     <Badge className="bg-white/10 text-white text-[8px] font-black uppercase px-2 py-0">
//       {stream}
//     </Badge>
//   )}
// </div>
//         </div>

//         <div className="mb-6 space-y-2">
//           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Coverage</span>
//             <span className="text-slate-300">{gradedTopics}/{totalTopics}</span>
//           </div>
//           <Progress value={progressPercent} className="h-1 bg-slate-950 [&>div]:bg-school-primary" />
//         </div>

//         <div className="flex items-center justify-between pt-4 border-t border-white/5">
//           <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">Open Syllabus</p>
//           <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ── CURRICULUM VIEW (Rest of component remains similar, just use gs data) ──
// function CurriculumView({ subject: gs, classTeacherName, onBack }: any) {
//     const [selectedTerm, setSelectedTerm] = useState<number>(1);
    
//     const terms = useMemo(() => {
//         const map: Record<number, any[]> = { 1: [], 2: [], 3: [] };
//         gs.topics?.forEach((t: any) => {
//             const idx = t.term?.index || 1;
//             if (map[idx]) map[idx].push(t);
//         });
//         return map;
//     }, [gs.topics]);

//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
//             <CardHeader className="bg-slate-950/50 p-8 border-b border-white/5">
//                 <div className="flex items-center gap-4 mb-8">
//                     <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 rounded-xl hover:bg-white/5">
//                         <ArrowLeft className="h-5 w-5 text-slate-400" />
//                     </Button>
//                     <div className="flex-1">
//                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                             {gs.subject.name}
//                         </h2>
//                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
//                             <User className="h-3 w-3 text-school-primary" /> Instructor: {classTeacherName}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                     {[1, 2, 3].map((idx) => (
//                         <button key={idx} onClick={() => setSelectedTerm(idx)} className={cn("p-4 rounded-2xl border text-left transition-all", selectedTerm === idx ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10")}>
//                             <p className="text-[9px] font-black uppercase tracking-[0.2em]">Term</p>
//                             <p className="text-lg font-black italic">0{idx}</p>
//                         </button>
//                     ))}
//                 </div>
//             </CardHeader>
//             <div className="p-8 space-y-3">
//                 {terms[selectedTerm]?.length === 0 ? (
//                     <p className="text-center py-10 text-slate-700 text-[10px] font-bold uppercase italic">No roadmap defined for this term</p>
//                 ) : (
//                     terms[selectedTerm].map((topic: any, index: number) => (
//                         <div key={topic.id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 group">
//                             <div className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">{topic.weekNumber || index + 1}</div>
//                             <div className="flex-1"><p className="text-sm font-black text-slate-200 uppercase tracking-tight italic">{topic.title}</p></div>
//                             <CheckCircle2 className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-colors" />
//                         </div>
//                     ))
//                 )}
//             </div>
//         </Card>
//     );
// }\



// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   BookOpen,
//   CheckCircle2,
//   ArrowLeft,
//   User,
//   ChevronRight,
//   BookX,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
// import { computeSubjectPerformance } from "@/lib/academics/compute-performance";

// // This helper matches your server logic to show badges in SSS
// function isNigerianCore(name: string) {
//   const core = ["english", "mathematics", "maths", "civic", "social", "economics", "biology"];
//   return core.some((kw) => name.toLowerCase().includes(kw));
// }

// interface SubjectsGridProps {
//   subjects: any[];
//   classTeacherName: string;
//   gradeLevel: number;
// }

// export function SubjectsGrid({
//   subjects,
//   classTeacherName,
//   gradeLevel,
// }: SubjectsGridProps) {
//   const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         classTeacherName={classTeacherName}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
//             {gradeLevel <= 9 ? "Full Curriculum" : "My Academic Load"}
//           </h2>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//             {gradeLevel <= 9
//               ? "Standard JSS syllabus automatically allocated"
//               : "Core subjects and selected electives"}
//           </p>
//         </div>

//         <Badge
//           variant="outline"
//           className="border-white/10 text-school-primary px-4 rounded-full font-black text-[10px] uppercase"
//         >
//           {subjects.length} Modules
//         </Badge>
//       </div>

//       {/* EMPTY STATE */}
//       {subjects.length === 0 ? (
//         <div className="py-20 text-center bg-slate-900/40 rounded-[2rem] border border-dashed border-white/5">
//           <BookX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//           <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">
//             No subjects found for this grade level
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {subjects.map((gs) => (
//             <SubjectCard
//               key={gs.id}
//               gs={gs}
//               classTeacherName={classTeacherName}
//               isSSS={gradeLevel >= 10}
//               onSelect={() => setSelectedSubject(gs)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ───────────────────────────────────────────── */
// /* SUBJECT CARD (WITH PERFORMANCE LOGIC)        */
// /* ───────────────────────────────────────────── */

// function SubjectCard({ gs, classTeacherName, isSSS, onSelect }: any) {
//   const totalTopics = gs.topics?.length || 0;
//   const gradedTopics = gs.assessments?.length || 0;

//   const progressPercent =
//     totalTopics > 0 ? (gradedTopics / totalTopics) * 100 : 0;

//   const { isCompulsory, stream } = classifyNigerianSubject(
//     gs.subject.name,
//     !isSSS
//   );

//   const isCore = isSSS && isCompulsory;

//   // ✅ PERFORMANCE ADDED (FIXED)
//   const performance = computeSubjectPerformance(gs.assessments || []);

//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer bg-slate-900 border-white/5 rounded-[2rem] transition-all hover:border-school-primary/30 shadow-xl overflow-hidden",
//         isCore && "border-school-primary/20 bg-school-primary/[0.02]"
//       )}
//       onClick={onSelect}
//     >
//       <CardContent className="p-6">
//         {/* HEADER */}
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div
//               className={cn(
//                 "p-3 rounded-xl",
//                 isCore
//                   ? "bg-school-primary text-slate-950"
//                   : "bg-school-primary/10 text-school-primary"
//               )}
//             >
//               <BookOpen className="h-5 w-5" />
//             </div>

//             <div className="min-w-0">
//               <h3 className="font-black text-white uppercase italic tracking-tighter leading-none truncate">
//                 {gs.subject.name}
//               </h3>
//               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 truncate">
//                 {classTeacherName}
//               </p>
//             </div>
//           </div>

//           {/* BADGES */}
//           <div className="flex gap-1">
//             {isCore && (
//               <Badge className="bg-school-primary text-slate-950 text-[8px] font-black uppercase px-2 py-0">
//                 Core
//               </Badge>
//             )}

//             {stream && !isCore && (
//               <Badge className="bg-white/10 text-white text-[8px] font-black uppercase px-2 py-0">
//                 {stream}
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* PERFORMANCE */}
//         <div className="mb-6 space-y-3">
//           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Score</span>
//             <span className="text-white">
//               {performance.total}%
//               <span className="ml-2 text-school-primary">
//                 ({performance.grade})
//               </span>
//             </span>
//           </div>

//           <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
//             <span>CA: {performance.ca}</span>
//             <span>Exam: {performance.exam}</span>
//           </div>
//         </div>

//         {/* COVERAGE */}
//         <div className="mb-6 space-y-2">
//           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Coverage</span>
//             <span className="text-slate-300">
//               {gradedTopics}/{totalTopics}
//             </span>
//           </div>

//           <Progress
//             value={progressPercent}
//             className="h-1 bg-slate-950 [&>div]:bg-school-primary"
//           />
//         </div>

//         {/* FOOTER */}
//         <div className="flex items-center justify-between pt-4 border-t border-white/5">
//           <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
//             Open Syllabus
//           </p>
//           <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /* ───────────────────────────────────────────── */
// /* CURRICULUM VIEW (UNCHANGED LOGIC)            */
// /* ───────────────────────────────────────────── */

// function CurriculumView({ subject: gs, classTeacherName, onBack }: any) {
//   const [selectedTerm, setSelectedTerm] = useState<number>(1);

//   const terms = useMemo(() => {
//     const map: Record<number, any[]> = { 1: [], 2: [], 3: [] };
//     gs.topics?.forEach((t: any) => {
//       const idx = t.term?.index || 1;
//       if (map[idx]) map[idx].push(t);
//     });
//     return map;
//   }, [gs.topics]);

//   return (
//     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
//       <CardHeader className="bg-slate-950/50 p-8 border-b border-white/5">
//         <div className="flex items-center gap-4 mb-8">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onBack}
//             className="h-10 w-10 rounded-xl hover:bg-white/5"
//           >
//             <ArrowLeft className="h-5 w-5 text-slate-400" />
//           </Button>

//           <div className="flex-1">
//             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//               {gs.subject.name}
//             </h2>

//             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
//               <User className="h-3 w-3 text-school-primary" />
//               Instructor: {classTeacherName}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-3">
//           {[1, 2, 3].map((idx) => (
//             <button
//               key={idx}
//               onClick={() => setSelectedTerm(idx)}
//               className={cn(
//                 "p-4 rounded-2xl border text-left transition-all",
//                 selectedTerm === idx
//                   ? "bg-school-primary border-school-primary text-slate-950 shadow-lg"
//                   : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
//               )}
//             >
//               <p className="text-[9px] font-black uppercase tracking-[0.2em]">
//                 Term
//               </p>
//               <p className="text-lg font-black italic">0{idx}</p>
//             </button>
//           ))}
//         </div>
//       </CardHeader>

//       <div className="p-8 space-y-3">
//         {terms[selectedTerm]?.length === 0 ? (
//           <p className="text-center py-10 text-slate-700 text-[10px] font-bold uppercase italic">
//             No roadmap defined for this term
//           </p>
//         ) : (
//           terms[selectedTerm].map((topic: any, index: number) => (
//             <div
//               key={topic.id}
//               className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 group"
//             >
//               <div className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">
//                 {topic.weekNumber || index + 1}
//               </div>

//               <div className="flex-1">
//                 <p className="text-sm font-black text-slate-200 uppercase tracking-tight italic">
//                   {topic.title}
//                 </p>
//               </div>

//               <CheckCircle2 className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-colors" />
//             </div>
//           ))
//         )}
//       </div>
//     </Card>
//   );
// }


// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   BookOpen,
//   CheckCircle2,
//   ArrowLeft,
//   User,
//   ChevronRight,
//   BookX,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
// import { computeSubjectPerformance } from "@/lib/academics/compute-performance";
// import { useRouter } from "next/navigation";
// /* ───────────────────────────────────────────── */

// interface SubjectsGridProps {
//   subjects: any[];
//   classTeacherName: string;
//   gradeLevel: number;
// }

// /* ───────────────────────────────────────────── */

// export function SubjectsGrid({
//   subjects,
//   classTeacherName,
//   gradeLevel,
// }: SubjectsGridProps) {
//   const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         classTeacherName={classTeacherName}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
//             {gradeLevel <= 9 ? "Full Curriculum" : "My Academic Load"}
//           </h2>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//             {gradeLevel <= 9
//               ? "Standard JSS syllabus automatically allocated"
//               : "Core subjects and selected electives"}
//           </p>
//         </div>

//         <Badge
//           variant="outline"
//           className="border-white/10 text-school-primary px-4 rounded-full font-black text-[10px] uppercase"
//         >
//           {subjects.length} Modules
//         </Badge>
//       </div>

//       {/* EMPTY STATE */}
//       {subjects.length === 0 ? (
//         <div className="py-20 text-center bg-slate-900/40 rounded-[2rem] border border-dashed border-white/5">
//           <BookX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//           <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">
//             No subjects found for this grade level
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {subjects.map((gs) => (
//             <SubjectCard
//               key={gs.id}
//               gs={gs}
//               classTeacherName={classTeacherName}
//               isSSS={gradeLevel >= 10}
//               onSelect={() => setSelectedSubject(gs)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ───────────────────────────────────────────── */
// /* SUBJECT CARD */
// /* ───────────────────────────────────────────── */

// function SubjectCard({ gs, classTeacherName, isSSS, onSelect }: any) {
//   const totalTopics = gs.topics?.length || 0;
//   const gradedTopics = gs.assessments?.length || 0;

//   const progressPercent =
//     totalTopics > 0 ? (gradedTopics / totalTopics) * 100 : 0;

//   const { isCompulsory, stream } = classifyNigerianSubject(
//     gs.subject.name,
//     !isSSS
//   );

//   const isCore = isSSS && isCompulsory;

//   const performance = computeSubjectPerformance(gs.assessments || []);

//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer bg-slate-900 border-white/5 rounded-[2rem] transition-all hover:border-school-primary/30 shadow-xl overflow-hidden",
//         isCore && "border-school-primary/20 bg-school-primary/[0.02]"
//       )}
//       onClick={onSelect}
//     >
//       <CardContent className="p-6">

//         {/* HEADER FIXED (ICON + NAME SEPARATED) */}
//         <div className="flex items-start justify-between mb-6">

//           {/* LEFT STACK */}
//           <div className="flex-1 min-w-0 space-y-3">

//             {/* ICON ROW */}
//             <div
//               className={cn(
//                 "p-3 rounded-xl w-fit",
//                 isCore
//                   ? "bg-school-primary text-slate-950"
//                   : "bg-school-primary/10 text-school-primary"
//               )}
//             >
//               <BookOpen className="h-5 w-5" />
//             </div>

//             {/* SUBJECT NAME ROW */}
//             <div className="min-w-0">
//               <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate">
//                 {gs.subject.name}
//               </h3>

//               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">
//                 {classTeacherName}
//               </p>
//             </div>

//           </div>

//           {/* BADGES */}
//           <div className="flex gap-1 shrink-0">
//             {isCore && (
//               <Badge className="bg-school-primary text-slate-950 text-[8px] font-black uppercase px-2 py-0">
//                 Core
//               </Badge>
//             )}

//             {stream && !isCore && (
//               <Badge className="bg-white/10 text-white text-[8px] font-black uppercase px-2 py-0">
//                 {stream}
//               </Badge>
//             )}
//           </div>

//         </div>

//         {/* PERFORMANCE */}
//         <div className="mb-6 space-y-3">

//           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Score</span>
//             <span className="text-white">
//               {performance.total}%
//               <span className="ml-2 text-school-primary">
//                 ({performance.grade})
//               </span>
//             </span>
//           </div>

//           <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
//             <span>CA: {performance.ca}</span>
//             <span>Exam: {performance.exam}</span>
//           </div>

//         </div>

//         {/* COVERAGE */}
//         <div className="mb-6 space-y-2">
//           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Coverage</span>
//             <span className="text-slate-300">
//               {gradedTopics}/{totalTopics}
//             </span>
//           </div>

//           <Progress
//             value={progressPercent}
//             className="h-1 bg-slate-950 [&>div]:bg-school-primary"
//           />
//         </div>

//         {/* FOOTER */}
//         <div className="flex items-center justify-between pt-4 border-t border-white/5">
//           <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
//             Open Syllabus
//           </p>

//           <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
//         </div>

//       </CardContent>
//     </Card>
//   );
// }

// /* ───────────────────────────────────────────── */
// /* CURRICULUM VIEW (UNCHANGED) */
// /* ───────────────────────────────────────────── */

// function CurriculumView({ subject: gs, classTeacherName, onBack }: any) {
//   const [selectedTerm, setSelectedTerm] = useState<number>(1);
//   const router = useRouter();

//   const terms = useMemo(() => {
//     const map: Record<number, any[]> = { 1: [], 2: [], 3: [] };

//     gs.topics?.forEach((t: any) => {
//       const idx = t.term?.index || 1;
//       if (map[idx]) map[idx].push(t);
//     });

//     return map;
//   }, [gs.topics]);

//   return (
//     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
//       <CardHeader className="bg-slate-950/50 p-8 border-b border-white/5">
//         <div className="flex items-center gap-4 mb-8">
//           <Button variant="ghost" size="icon" onClick={onBack}>
//             <ArrowLeft className="h-5 w-5 text-slate-400" />
//           </Button>

//           <div className="flex-1">
//             <h2 className="text-3xl font-black text-white uppercase italic">
//               {gs.subject.name}
//             </h2>

//             <p className="text-xs text-slate-500 font-bold uppercase mt-2 flex items-center gap-2">
//               <User className="h-3 w-3 text-school-primary" />
//               Instructor: {classTeacherName}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-3">
//           {[1, 2, 3].map((idx) => (
//             <button
//               key={idx}
//               onClick={() => setSelectedTerm(idx)}
//               className={cn(
//                 "p-4 rounded-2xl border text-left",
//                 selectedTerm === idx
//                   ? "bg-school-primary text-slate-950"
//                   : "bg-slate-950 border-white/5 text-slate-500"
//               )}
//             >
//               <p className="text-[9px] font-black uppercase">Term</p>
//               <p className="text-lg font-black italic">0{idx}</p>
//             </button>
//           ))}
//         </div>
//       </CardHeader>

//       <div className="p-8 space-y-3">
//         {terms[selectedTerm]?.length === 0 ? (
//           <p className="text-center py-10 text-slate-700 text-[10px] font-bold uppercase italic">
//             No roadmap defined for this term
//           </p>
//         ) : (
//           terms[selectedTerm].map((topic: any, index: number) => (
        
//               <div
//                 key={topic.id}
//                 onClick={() => router.push(`/student/lessons/${topic.id}`)}
//                 className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-school-primary/30 transition-all group"
//               >
//               <div className="h-8 w-8 flex items-center justify-center text-[10px] font-black text-slate-500">
//                 {topic.weekNumber || index + 1}
//               </div>

//               <div className="flex-1">
//                 <p className="text-sm font-black text-slate-200 uppercase">
//                   {topic.title}
//                 </p>
//               </div>

//               <CheckCircle2 className="h-4 w-4 text-slate-800" />
//             </div>
//           ))
//         )}
//       </div>
//     </Card>
//   );
// }


"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  User,
  ChevronRight,
  BookX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
import { computeSubjectPerformance } from "@/lib/academics/compute-performance";
import { useRouter } from "next/navigation";

// ── Types ───────────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  title: string;
  weekNumber?: number | null;
  term?: {
    index: number;
  } | null;
}

interface Assessment {
  id: string;
  score: number | null;
  maxScore: number | null;
  type: string;
}

interface GradeSubject {
  id: string;
  subject: {
    name: string;
  };
  topics: Topic[];
  assessments: Assessment[];
}

interface SubjectsGridProps {
  subjects: GradeSubject[];
  classTeacherName: string;
  gradeLevel: number;
}

// ── Main Component ──────────────────────────────────────────────────────────

export function SubjectsGrid({
  subjects,
  classTeacherName,
  gradeLevel,
}: SubjectsGridProps) {
  const [selectedSubject, setSelectedSubject] = useState<GradeSubject | null>(null);

  if (selectedSubject) {
    return (
      <CurriculumView
        subject={selectedSubject}
        classTeacherName={classTeacherName}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            {gradeLevel <= 9 ? "Full Curriculum" : "My Academic Load"}
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            {gradeLevel <= 9
              ? "Standard JSS syllabus automatically allocated"
              : "Core subjects and selected electives"}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-white/10 text-school-primary px-4 rounded-full font-black text-[10px] uppercase"
        >
          {subjects.length} Modules
        </Badge>
      </div>

      {subjects.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-[2rem] border border-dashed border-white/5">
          <BookX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
          <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">
            No subjects found for this grade level
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((gs) => (
            <SubjectCard
              key={gs.id}
              gs={gs}
              classTeacherName={classTeacherName}
              isSSS={gradeLevel >= 10}
              onSelect={() => setSelectedSubject(gs)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Subject Card ─────────────────────────────────────────────────────────────

interface SubjectCardProps {
  gs: GradeSubject;
  classTeacherName: string;
  isSSS: boolean;
  onSelect: () => void;
}

function SubjectCard({ gs, classTeacherName, isSSS, onSelect }: SubjectCardProps) {
  const totalTopics = gs.topics?.length || 0;
  const gradedTopics = gs.assessments?.length || 0;

  const progressPercent =
    totalTopics > 0 ? (gradedTopics / totalTopics) * 100 : 0;

  const { isCompulsory, stream } = classifyNigerianSubject(
    gs.subject.name,
    !isSSS
  );

  const isCore = isSSS && isCompulsory;

  // Assuming computeSubjectPerformance accepts the typed assessment array
  const performance = computeSubjectPerformance(gs.assessments || []);

  return (
    <Card
      className={cn(
        "group cursor-pointer bg-slate-900 border-white/5 rounded-[2rem] transition-all hover:border-school-primary/30 shadow-xl overflow-hidden",
        isCore && "border-school-primary/20 bg-school-primary/[0.02]"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0 space-y-3">
            <div
              className={cn(
                "p-3 rounded-xl w-fit",
                isCore
                  ? "bg-school-primary text-slate-950"
                  : "bg-school-primary/10 text-school-primary"
              )}
            >
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate">
                {gs.subject.name}
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">
                {classTeacherName}
              </p>
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            {isCore && (
              <Badge className="bg-school-primary text-slate-950 text-[8px] font-black uppercase px-2 py-0">
                Core
              </Badge>
            )}
            {stream && !isCore && (
              <Badge className="bg-white/10 text-white text-[8px] font-black uppercase px-2 py-0">
                {stream}
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500">Score</span>
            <span className="text-white">
              {performance.total}%
              <span className="ml-2 text-school-primary">
                ({performance.grade})
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <span>CA: {performance.ca}</span>
            <span>Exam: {performance.exam}</span>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
            <span className="text-slate-500">Coverage</span>
            <span className="text-slate-300">
              {gradedTopics}/{totalTopics}
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-1 bg-slate-950 [&>div]:bg-school-primary"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
            Open Syllabus
          </p>
          <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Curriculum View ──────────────────────────────────────────────────────────

interface CurriculumViewProps {
  subject: GradeSubject;
  classTeacherName: string;
  onBack: () => void;
}

function CurriculumView({ subject: gs, classTeacherName, onBack }: CurriculumViewProps) {
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const router = useRouter();

  const terms = useMemo(() => {
    const map: Record<number, Topic[]> = { 1: [], 2: [], 3: [] };

    gs.topics?.forEach((t: Topic) => {
      const idx = t.term?.index || 1;
      if (map[idx]) map[idx].push(t);
    });

    return map;
  }, [gs.topics]);

  return (
    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
      <CardHeader className="bg-slate-950/50 p-8 border-b border-white/5">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl hover:bg-white/5">
            <ArrowLeft className="h-5 w-5 text-slate-400" />
          </Button>

          <div className="flex-1">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {gs.subject.name}
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase mt-2 flex items-center gap-2">
              <User className="h-3 w-3 text-school-primary" />
              Instructor: {classTeacherName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTerm(idx)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all",
                selectedTerm === idx
                  ? "bg-school-primary text-slate-950 border-school-primary shadow-lg"
                  : "bg-slate-950 border-white/5 text-slate-500"
              )}
            >
              <p className="text-[9px] font-black uppercase tracking-widest">Term</p>
              <p className="text-lg font-black italic">0{idx}</p>
            </button>
          ))}
        </div>
      </CardHeader>

      <div className="p-8 space-y-3">
        {!terms[selectedTerm] || terms[selectedTerm].length === 0 ? (
          <p className="text-center py-10 text-slate-700 text-[10px] font-black uppercase italic tracking-widest">
            No roadmap defined for this term
          </p>
        ) : (
          terms[selectedTerm].map((topic: Topic, index: number) => (
              <div
                key={topic.id}
                onClick={() => router.push(`/student/lessons/${topic.id}`)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-school-primary/30 transition-all group"
              >
              <div className="h-8 w-8 flex items-center justify-center text-[10px] font-black text-slate-500">
                {topic.weekNumber || index + 1}
              </div>

              <div className="flex-1">
                <p className="text-sm font-black text-slate-200 uppercase italic">
                  {topic.title}
                </p>
              </div>

              <CheckCircle2 className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-colors" />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}