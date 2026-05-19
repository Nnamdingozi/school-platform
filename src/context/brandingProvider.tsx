// "use client";

// import { useEffect } from "react";
// import { useProfileStore } from "@/store/profileStore";

// /**
//  * Rule 11: Final System Truth Sync
//  * Keeps the CSS variables in sync with the Zustand store.
//  */
// export function BrandingProvider({ children }: { children: React.ReactNode }) {
//   const { profile } = useProfileStore();

//   useEffect(() => {
//     // Only apply if profile data exists to avoid "disappearing" colors
//     if (profile?.primaryColor && profile?.secondaryColor) {
//       const root = document.documentElement;
//       root.style.setProperty("--school-primary-raw", profile.primaryColor);
//       root.style.setProperty("--school-secondary-raw", profile.secondaryColor);
//     }
//   }, [profile?.primaryColor, profile?.secondaryColor]);

//   return <>{children}</>;
// }





"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/store/profileStore";

/**
 * Rule 11/18: Real-time Design Token Synchronization.
 * Converts DB Hex colors into CSS Variables and RGB fragments.
 */
export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfileStore();

  useEffect(() => {
    if (!profile?.primaryColor || !profile?.secondaryColor) return;

    const root = document.documentElement;

    // Helper to convert #hex to "R G B" for tailwind opacity support
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r} ${g} ${b}`;
    };

    // Set CSS Variables
    root.style.setProperty("--school-primary", profile.primaryColor);
    root.style.setProperty("--school-secondary", profile.secondaryColor);
    
    // Set RGB fragments for tailwind opacity utilities (bg-school-primary/10)
    root.style.setProperty("--school-primary-rgb", hexToRgb(profile.primaryColor));
    root.style.setProperty("--school-secondary-rgb", hexToRgb(profile.secondaryColor));

  }, [profile?.primaryColor, profile?.secondaryColor]);

  return <>{children}</>;
}