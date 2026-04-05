'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { searchUsersByRole } from '@/app/actions/parent-linking';
import { Role } from '@prisma/client';

interface UserSearchInputProps {
  role: 'PARENT' | 'STUDENT';
  schoolId: string;
  placeholder: string;
  value: string;
  onSelect: (email: string) => void;
  disabled?: boolean;
}

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

  // Sync internal query with external value (e.g., when CSV is uploaded)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle Search Logic
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
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, schoolId, role, isOpen]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        // Close dropdown when clicking away (optional, can be improved with a ref)
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-school-primary outline-none transition-all"
      />

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-[110] top-full mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-school-primary" />
              Searching...
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
                className="w-full text-school-secondary-50 text-left p-4 hover:bg-school-primary hover:text-school-secondary-950 transition-colors border-b border-white/5 last:border-0"
              >
                <p className="font-bold text-xs uppercase tracking-tight">
                  {user.name ?? 'Unnamed User'}
                </p>
                <p className="text-[10px] opacity-60 font-mono">
                  {user.email}
                </p>
              </button>
            ))
          ) : (
            <div className="p-4 text-xs text-slate-500 italic">
              No {role.toLowerCase()}s found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}