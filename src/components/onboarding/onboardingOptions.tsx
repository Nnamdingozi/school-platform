// import Link from "next/link";
// import { GraduationCap, School, ArrowRight, LucideIcon } from "lucide-react";

// // These onboarding flows already exist — this component only routes to them.
// const ROUTES = {
//     SCHOOL_ONBOARDING: "/onboarding",
//     LEARNER_ONBOARDING: "/onboarding/individual",
// } as const;

// interface OnboardingOption {
//     id: "school" | "learner";
//     title: string;
//     description: string;
//     bullets: string[];
//     icon: LucideIcon;
//     href: string;
// }

// const onboardingOptions: OnboardingOption[] = [
//     {
//         id: "school",
//         title: "I'm setting up a school",
//         description:
//             "Create your institution's workspace, invite staff, and configure classes, terms, and billing.",
//         bullets: ["Admin & staff accounts", "Class & term setup", "Bulk student import"],
//         icon: School,
//         href: ROUTES.SCHOOL_ONBOARDING,
//     },
//     {
//         id: "learner",
//         title: "I'm an individual learner",
//         description:
//             "Set up your personal profile and start learning at your own pace — no institution required.",
//         bullets: ["Personal profile", "Pick your courses", "Learn at your own pace"],
//         icon: GraduationCap,
//         href: ROUTES.LEARNER_ONBOARDING,
//     },
// ];

// export function OnboardingOptions() {
//     return (
//         <div className="w-full max-w-3xl">
//             <div className="text-center mb-10">
//                 <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
//                     How do you want to get started?
//                 </h1>
//                 <p className="mt-3 text-muted-foreground text-lg">
//                     Choose the option that fits you best. You can always invite more people later.
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {onboardingOptions.map((option) => {
//                     const Icon = option.icon;
//                     return (
//                         <Link
//                             key={option.id}
//                             href={option.href}
//                             className="group text-left bg-card border border-border rounded-lg p-8
//                                        hover:border-primary/50 hover:shadow-md transition-all duration-200
//                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
//                                        flex flex-col h-full"
//                         >
//                             <div
//                                 className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-5
//                                            group-hover:bg-primary/15 transition-colors"
//                             >
//                                 <Icon className="w-6 h-6 text-primary" />
//                             </div>

//                             <h2 className="text-xl font-semibold text-card-foreground mb-2">
//                                 {option.title}
//                             </h2>
//                             <p className="text-muted-foreground mb-5">{option.description}</p>

//                             <ul className="space-y-2 mb-6 flex-1">
//                                 {option.bullets.map((b) => (
//                                     <li key={b} className="text-sm text-muted-foreground flex items-center gap-2">
//                                         <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
//                                         {b}
//                                     </li>
//                                 ))}
//                             </ul>

//                             <span className="inline-flex items-center gap-1.5 text-primary font-medium">
//                                 Continue
//                                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                             </span>
//                         </Link>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }



import Link from "next/link";
import { GraduationCap, School, ArrowRight, LucideIcon } from "lucide-react";

// These onboarding flows already exist — this component only routes to them.
const ROUTES = {
    SCHOOL_ONBOARDING: "/onboarding",
    LEARNER_ONBOARDING: "/onboarding/individual",
} as const;

interface OnboardingOption {
    id: "school" | "learner";
    title: string;
    description: string;
    bullets: string[];
    icon: LucideIcon;
    href: string;
}

const onboardingOptions: OnboardingOption[] = [
    {
        id: "school",
        title: "I'm setting up a school",
        description:
            "Create your institution's workspace, invite staff, and configure classes and billing.",
        bullets: ["Admin & staff accounts", "Class & term setup", "Bulk student import"],
        icon: School,
        href: ROUTES.SCHOOL_ONBOARDING,
    },
    {
        id: "learner",
        title: "I'm an individual learner",
        description:
            "Set up your personal profile and start learning at your own pace.",
        bullets: ["Personal profile", "Pick your courses", "Learn at your own pace"],
        icon: GraduationCap,
        href: ROUTES.LEARNER_ONBOARDING,
    },
];

export function OnboardingOptions() {
    return (
        <div className="w-full max-w-2xl">
            <div className="text-center mb-8 animate-in fade-in-0 slide-in-from-top-2 duration-700">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                    How do you want to get started?
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Choose the option that fits you best.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {onboardingOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <Link
                            key={option.id}
                            href={option.href}
                            style={{ animationDelay: `${index * 120}ms` }}
                            className="group relative text-left bg-card border border-border rounded-lg p-5
                                       transition-all duration-300 ease-out
                                       hover:border-school-primary/50 hover:shadow-lg hover:shadow-school-primary/10
                                       hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]
                                       focus:outline-none focus-visible:ring-2 focus-visible:ring-school-primary
                                       animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards duration-700
                                       flex flex-col h-full overflow-hidden"
                        >
                            {/* Ambient glow that fades in on hover, tinted with the school color */}
                            <span
                                className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full
                                           bg-school-primary/20 blur-2xl opacity-0 group-hover:opacity-100
                                           transition-opacity duration-500"
                            />

                            <div
                                className="relative w-10 h-10 rounded-md bg-school-primary/10 flex items-center justify-center mb-4
                                           transition-all duration-300
                                           group-hover:bg-school-primary/20 group-hover:scale-110 group-hover:rotate-3"
                            >
                                <Icon className="w-5 h-5 text-school-primary" />
                            </div>

                            <h2 className="relative text-lg font-semibold text-card-foreground mb-1.5">
                                {option.title}
                            </h2>
                            <p className="relative text-sm text-muted-foreground mb-4">
                                {option.description}
                            </p>

                            <ul className="relative space-y-1.5 mb-4 flex-1">
                                {option.bullets.map((b) => (
                                    <li key={b} className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-school-primary shrink-0" />
                                        {b}
                                    </li>
                                ))}
                            </ul>

                            <span className="relative inline-flex items-center gap-1.5 text-sm text-school-primary font-medium">
                                Continue
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

