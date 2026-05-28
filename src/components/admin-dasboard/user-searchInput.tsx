// 'use client';

// import { useState, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';
// import { searchUsersByRole } from '@/app/actions/parent-linking';
// import { Role } from '@prisma/client';

// interface UserSearchInputProps {
//   role: 'PARENT' | 'STUDENT';
//   schoolId: string;
//   placeholder: string;
//   value: string;
//   onSelect: (email: string) => void;
//   disabled?: boolean;
// }

// export function UserSearchInput({
//   role,
//   schoolId,
//   placeholder,
//   value,
//   onSelect,
//   disabled
// }: UserSearchInputProps) {
//   const [query, setQuery] = useState(value);
//   const [results, setResults] = useState<{ id: string; name: string | null; email: string }[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   // Sync internal query with external value (e.g., when CSV is uploaded)
//   useEffect(() => {
//     setQuery(value);
//   }, [value]);

//   // Handle Search Logic
//   useEffect(() => {
//     if (query.length < 2 || !isOpen) {
//       setResults([]);
//       return;
//     }

//     const delayDebounce = setTimeout(async () => {
//       setIsSearching(true);
//       try {
//         const res = await searchUsersByRole(schoolId, query, role as Role);
//         setResults(res);
//       } catch (err) {
//         console.error("Search failed", err);
//       } finally {
//         setIsSearching(false);
//       }
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [query, schoolId, role, isOpen]);

//   return (
//     <div className="relative w-full">
//       <input
//         type="text"
//         value={query}
//         disabled={disabled}
//         onChange={(e) => {
//           setQuery(e.target.value);
//           setIsOpen(true);
//         }}
//         onFocus={() => setIsOpen(true)}
//         // Close dropdown when clicking away (optional, can be improved with a ref)
//         onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
//         placeholder={placeholder}
//         className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-school-primary outline-none transition-all"
//       />

//       {/* Dropdown Results */}
//       {isOpen && query.length >= 2 && (
//         <div className="absolute z-[110] top-full mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
//           {isSearching ? (
//             <div className="p-4 text-xs text-slate-500 flex items-center gap-2">
//               <Loader2 className="h-3 w-3 animate-spin text-school-primary" />
//               Searching...
//             </div>
//           ) : results.length > 0 ? (
//             results.map((user) => (
//               <button
//                 key={user.id}
//                 type="button"
//                 onClick={() => {
//                   onSelect(user.email);
//                   setQuery(user.email);
//                   setIsOpen(false);
//                 }}
//                 className="w-full text-school-secondary-50 text-left p-4 hover:bg-school-primary hover:text-school-secondary-950 transition-colors border-b border-white/5 last:border-0"
//               >
//                 <p className="font-bold text-xs uppercase tracking-tight">
//                   {user.name ?? 'Unnamed User'}
//                 </p>
//                 <p className="text-[10px] opacity-60 font-mono">
//                   {user.email}
//                 </p>
//               </button>
//             ))
//           ) : (
//             <div className="p-4 text-xs text-slate-500 italic">
//               No {role.toLowerCase()}s found matching &quot;{query}&quot;
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Search, User } from 'lucide-react';
import { searchUsersByRole } from '@/app/actions/parent-linking';
import { Role } from '@prisma/client';
import { cn } from '@/lib/utils';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface UserSearchInputProps {
  role: 'PARENT' | 'STUDENT';
  schoolId: string;
  placeholder: string;
  value: string;
  onSelect: (email: string) => void;
  disabled?: boolean;
}

/**
 * REGISTRY SEARCH INPUT (Tier 2/3 Utility)
 * Rule 11: High-density Typography (font-bold uppercase metadata).
 * Rule 18: Semantic Color Flip (bg-surface, bg-card, border-border).
 * Rule 19: Standardized Geometry (rounded-xl, rounded-2xl).
 */
export function UserSearchInput({
  role,
  schoolId,
  placeholder,
  value,
  onSelect,
  disabled
}: UserSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<{ id: string; name: string | null; email: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Rule 14: Sync internal query with external value changes (e.g. CSV automation)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle Search Logic with Debounce
  useEffect(() => {
    if (query.length < 2 || !isOpen) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchUsersByRole(schoolId, query, role as Role);
        setResults(res);
      } catch (err) {
        console.error("[SEARCH_FAULT]: Registry query failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, schoolId, role, isOpen]);

  return (
    <div className="relative w-full group">
      <div className="relative">
        <input
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          // Close dropdown with delay to allow result selection
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-3.5 pl-11 outline-none transition-all",
            "bg-surface border border-border rounded-xl", // Rule 18 & 19
            "text-sm font-semibold text-foreground placeholder:text-muted-foreground/50",
            "focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
      </div>

      {/* ── DROPDOWN RESULTS (Rule 19) ── */}
      {isOpen && query.length >= 2 && (
        <div className={cn(
          "absolute z-[110] top-full mt-2 w-full",
          "bg-card border border-border rounded-2xl shadow-2xl", // Rule 18
          "overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200"
        )}>
          {isSearching ? (
            <div className="p-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
              <Loader2 className="h-3 w-3 animate-spin text-school-primary" />
              Scanning Registry...
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  onSelect(user.email);
                  setQuery(user.email);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left p-4 transition-all border-b border-border last:border-0",
                  "hover:bg-school-primary hover:text-on-school-primary" // Rule 18 Contrast
                )}
              >
                <div className="flex items-center gap-3">
                    <User className="h-3.5 w-3.5 opacity-40 shrink-0" />
                    <div>
                        <p className="font-bold text-xs uppercase tracking-tight">
                            {user.name ?? 'Anonymous Node'}
                        </p>
                        <p className="text-[10px] opacity-70 font-mono mt-0.5">
                            {user.email}
                        </p>
                    </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
              No matching {role.toLowerCase()}s discovered
            </div>
          )}
        </div>
      )}
    </div>
  );
}