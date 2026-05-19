import { type CSSProperties } from 'react';



/**
 * school-theme.ts
 *
 * Apply a school's brand colors to the <html> element and automatically
 * derive contrast-safe foreground tokens so text is always readable.
 *
 * Usage (call once on app init or when school data loads):
 *
 *   import { applySchoolTheme } from "@/lib/school-theme";
 *   applySchoolTheme({ primary: "#f59e0b", secondary: "#1e293b" });
 *
 * Also export the pure utility functions for use in server-side
 * generation of inline styles if needed.
 */

/** Convert a hex color to an [r, g, b] tuple in 0–255 range. */
export function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace(/^#/, "");
    const full =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  
  /**
   * Calculate relative luminance per WCAG 2.1.
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  export function relativeLuminance(r: number, g: number, b: number): number {
    const toLinear = (c: number) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }
  
  /**
   * Calculate WCAG contrast ratio between two colors.
   * Returns a value between 1 (no contrast) and 21 (black on white).
   */
  export function contrastRatio(
    [r1, g1, b1]: [number, number, number],
    [r2, g2, b2]: [number, number, number]
  ): number {
    const L1 = relativeLuminance(r1, g1, b1);
    const L2 = relativeLuminance(r2, g2, b2);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * Given a background color hex, return either "#0a0a0a" (near-black)
   * or "#f5f5f5" (near-white) — whichever achieves better WCAG contrast.
   *
   * WCAG AA requires ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
   * This function picks the best option available. If neither clears
   * 4.5:1 (can happen with mid-range saturated colors), it picks the
   * higher ratio and logs a warning.
   */
  export function getContrastForeground(bgHex: string): string {
    const bg = hexToRgb(bgHex);
    const black: [number, number, number] = [10, 10, 10];
    const white: [number, number, number] = [245, 245, 245];
  
    const blackRatio = contrastRatio(bg, black);
    const whiteRatio = contrastRatio(bg, white);
  
    if (blackRatio >= 4.5 && whiteRatio >= 4.5) {
      // Both pass — prefer black (slightly higher perceived contrast)
      return "#0a0a0a";
    }
  
    if (blackRatio >= 4.5) return "#0a0a0a";
    if (whiteRatio >= 4.5) return "#f5f5f5";
  
    // Neither clears AA — pick the better ratio and warn
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[school-theme] Low contrast for background ${bgHex}. ` +
          `Black: ${blackRatio.toFixed(2)}:1, White: ${whiteRatio.toFixed(2)}:1. ` +
          `WCAG AA requires 4.5:1. Consider choosing a different brand color.`
      );
    }
  
    return blackRatio >= whiteRatio ? "#0a0a0a" : "#f5f5f5";
  }
  
  export interface SchoolTheme {
    /** School's primary brand color as a hex string, e.g. "#f59e0b" */
    primary: string;
    /** School's secondary brand color as a hex string, e.g. "#1e293b" */
    secondary: string;
  }
  
  /**
   * Apply school colors to the document root (<html> element).
   * Call this in a client component or layout effect.
   *
   * Example — in a Next.js layout or provider:
   *
   *   "use client";
   *   import { useEffect } from "react";
   *   import { applySchoolTheme } from "@/lib/school-theme";
   *
   *   export function SchoolThemeProvider({ primary, secondary, children }) {
   *     useEffect(() => {
   *       applySchoolTheme({ primary, secondary });
   *     }, [primary, secondary]);
   *     return children;
   *   }
   */
  export function applySchoolTheme({ primary, secondary }: SchoolTheme): void {
    if (typeof document === "undefined") return; // SSR guard
  
    const root = document.documentElement;
  
    // Set the raw brand colors
    root.style.setProperty("--school-primary-raw", primary);
    root.style.setProperty("--school-secondary-raw", secondary);
  
    // Compute and set contrast-safe foreground tokens
    const primaryFg = getContrastForeground(primary);
    const secondaryFg = getContrastForeground(secondary);
  
    root.style.setProperty("--school-primary-foreground", primaryFg);
    root.style.setProperty("--school-secondary-foreground", secondaryFg);
  }
  
  /**
   * Generate an inline style object for SSR / RSC contexts where you
   * can't use document.documentElement.style.setProperty.
   *
   * Example — in a Next.js root layout:
   *
   *   import { getSchoolThemeStyle } from "@/lib/school-theme";
   *
   *   export default function RootLayout({ children }) {
   *     const school = await getSchoolFromSession(); // your data fetch
   *     const themeStyle = getSchoolThemeStyle({
   *       primary: school.primaryColor,
   *       secondary: school.secondaryColor,
   *     });
   *     return (
   *       <html lang="en" style={themeStyle}>
   *         <body>{children}</body>
   *       </html>
   *     );
   *   }
   */
  // export function getSchoolThemeStyle({
  //   primary,
  //   secondary,
  // }: SchoolTheme): React.CSSProperties {
  //   return {
  //     "--school-primary-raw": primary,
  //     "--school-secondary-raw": secondary,
  //     "--school-primary-foreground": getContrastForeground(primary),
  //     "--school-secondary-foreground": getContrastForeground(secondary),
  //   } as React.CSSProperties;
  // }


 

  /**
   * Rule 18: Generates an inline style object for the <html> tag.
   * This is the secret to stopping the color flash.
   */
  export function getSchoolThemeStyle(primary: string | null, secondary: string | null): CSSProperties {
      if (!primary || !secondary) return {};
  
      return {
          "--school-primary-raw": primary,
          "--school-secondary-raw": secondary,
          // Optional: you can add foreground calculation here too
      } as CSSProperties;
  }

  
  /**
   * Validate a school's chosen colors during registration.
   * Returns warnings so the UI can prompt schools to pick better colors.
   */
  export interface ColorValidationResult {
    primaryForeground: string;
    secondaryForeground: string;
    primaryPasses: boolean;
    secondaryPasses: boolean;
    primaryRatio: number;
    secondaryRatio: number;
    warnings: string[];
  }
  
  export function validateSchoolColors({
    primary,
    secondary,
  }: SchoolTheme): ColorValidationResult {
    const primaryBg = hexToRgb(primary);
    const secondaryBg = hexToRgb(secondary);
  
    const primaryFg = getContrastForeground(primary);
    const secondaryFg = getContrastForeground(secondary);
  
    const primaryRatio = contrastRatio(primaryBg, hexToRgb(primaryFg));
    const secondaryRatio = contrastRatio(secondaryBg, hexToRgb(secondaryFg));
  
    const warnings: string[] = [];
  
    if (primaryRatio < 4.5) {
      warnings.push(
        `Your primary color (#${primary}) may be hard to read on text. ` +
          `Best contrast available: ${primaryRatio.toFixed(1)}:1 (WCAG AA needs 4.5:1). ` +
          `Try a darker or lighter shade.`
      );
    }
  
    if (secondaryRatio < 4.5) {
      warnings.push(
        `Your secondary color (#${secondary}) may be hard to read on text. ` +
          `Best contrast available: ${secondaryRatio.toFixed(1)}:1 (WCAG AA needs 4.5:1). ` +
          `Try a darker or lighter shade.`
      );
    }
  
    // Warn if the two colors are too similar (low contrast between them)
    const colorContrast = contrastRatio(primaryBg, secondaryBg);
    if (colorContrast < 3) {
      warnings.push(
        `Your primary and secondary colors are very similar (${colorContrast.toFixed(1)}:1 contrast). ` +
          `Consider choosing colors with more contrast between them for a cleaner look.`
      );
    }
  
    return {
      primaryForeground: primaryFg,
      secondaryForeground: secondaryFg,
      primaryPasses: primaryRatio >= 4.5,
      secondaryPasses: secondaryRatio >= 4.5,
      primaryRatio,
      secondaryRatio,
      warnings,
    };
  }