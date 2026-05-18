// // src/app/(landing)/layout.tsx
// import { Navbar } from "@/components/landing/navbar";
// import { Footer } from "@/components/landing/footer";

// export default function LandingLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <>
//             <Navbar />
//             {children}
//             <Footer />
//         </>
//     );
// }


// src/app/(landing)/layout.tsx
//
// Theme and school colors are handled by the root layout (app/layout.tsx).
// This layout only adds the Navbar and Footer around landing page content.

import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
