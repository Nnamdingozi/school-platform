'use client';

import { useCallback, useRef, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import {
  CheckCircle2,
  Download,
  Link2,
  Loader2,
  Upload,
  X,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import {
  bulkLinkParentsAndChildren,
  type ParentChildLinkInput,
  type ParentChildLinkResult,
} from '@/app/actions/parent-linking';

type RowStatus = 'idle' | 'linking' | 'linked' | 'error';

type LinkRow = {
  id: string;
  parentEmail: string;
  childEmail: string;
  status: RowStatus;
  message?: string;
};

type CsvRow = {
  parent_email?: string;
  parentEmail?: string;
  parent?: string;
  child_email?: string;
  childEmail?: string;
  student?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const makeRow = (parentEmail = '', childEmail = ''): LinkRow => ({
  id: crypto.randomUUID(),
  parentEmail,
  childEmail,
  status: 'idle',
});

export function ParentChildLinker() {
  const [rows, setRows] = useState<LinkRow[]>([makeRow()]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { profile } = useProfileStore();
  const schoolId = profile?.schoolId ?? '';

  const updateRow = (id: string, patch: Partial<LinkRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((row) => row.id !== id)));
  };

  const addRow = () => setRows((prev) => [...prev, makeRow()]);

  const clearAll = () => setRows([makeRow()]);

  const parseCsv = useCallback((file: File) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<CsvRow>) => {
        const parsed = result.data
          .map((row): LinkRow => {
            const parentEmail =
              String(
                row.parent_email ??
                  row.parentEmail ??
                  row.parent ??
                  '',
              ).trim();
            const childEmail =
              String(
                row.child_email ??
                  row.childEmail ??
                  row.student ??
                  '',
              ).trim();
            return makeRow(parentEmail, childEmail);
          })
          .filter((row) => row.parentEmail.length > 0 || row.childEmail.length > 0);

        if (parsed.length > 0) {
          setRows(parsed);
        }
      },
      error: () => {
        // eslint-disable-next-line no-alert
        alert('Failed to parse CSV. Please check the format.');
      },
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCsv(file);
    }
    // reset input so selecting the same file again still fires change
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      parseCsv(file);
    }
  };

  const downloadTemplate = () => {
    const csv = 'parent_email,child_email\nparent@example.com,child1@example.com\nparent@example.com,child2@example.com';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parent-children-link-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLinkAll = async () => {
    if (!schoolId) {
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          status: 'error',
          message: 'Missing school context. Please reload and ensure you are logged in as an admin.',
        })),
      );
      return;
    }

    // basic client-side validation
    const hasInvalid = rows.some(
      (row) =>
        !row.parentEmail.trim() ||
        !row.childEmail.trim() ||
        !EMAIL_REGEX.test(row.parentEmail) ||
        !EMAIL_REGEX.test(row.childEmail),
    );

    if (hasInvalid) {
      setRows((prev) =>
        prev.map((row) => {
          const parentMissing = !row.parentEmail.trim();
          const childMissing = !row.childEmail.trim();
          const parentInvalid = !parentMissing && !EMAIL_REGEX.test(row.parentEmail);
          const childInvalid = !childMissing && !EMAIL_REGEX.test(row.childEmail);

          if (parentMissing || childMissing || parentInvalid || childInvalid) {
            let message = '';
            if (parentMissing || childMissing) {
              message = 'Parent and child email are required.';
            } else if (parentInvalid || childInvalid) {
              message = 'Invalid email format.';
            }

            return {
              ...row,
              status: 'error',
              message,
            };
          }
          return row;
        }),
      );
      return;
    }

    setSubmitting(true);
    setRows((prev) =>
      prev.map((row) =>
        row.status === 'linked'
          ? row
          : {
              ...row,
              status: 'linking',
              message: undefined,
            },
      ),
    );

    const payload: ParentChildLinkInput[] = rows.map((row) => ({
      parentEmail: row.parentEmail,
      childEmail: row.childEmail,
    }));

    const results: ParentChildLinkResult[] = await bulkLinkParentsAndChildren(
      payload,
      schoolId,
    );

    setRows((prev) =>
      prev.map((row, index) => {
        const result = results[index];
        if (!result) {
          return row;
        }
        return {
          ...row,
          status: result.success ? 'linked' : 'error',
          message: result.message,
        };
      }),
    );

    setSubmitting(false);
  };

  const linkedCount = rows.filter((row) => row.status === 'linked').length;
  const errorCount = rows.filter((row) => row.status === 'error').length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-50 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-amber-400" />
            Link parents to children
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Upload a CSV to create parent → student relationships inside this school. Parents
            must already exist with role PARENT; children must exist with role STUDENT.
          </p>
        </div>
        {rows.length > 1 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {(linkedCount > 0 || errorCount > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          {linkedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              {linkedCount} link{linkedCount > 1 ? 's' : ''} created
            </span>
          )}
          {errorCount > 0 && (
            <span className="inline-flex items-center gap-1 text-red-400">
              <XCircle className="h-3 w-3" />
              {errorCount} error{errorCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mt-4 rounded-xl border-2 border-dashed p-4 text-center text-xs transition-colors ${
          dragOver
            ? 'border-amber-500 bg-amber-500/5'
            : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
        }`}
      >
        <Upload className="mx-auto mb-2 h-5 w-5 text-slate-500" />
        <p className="text-slate-300 font-medium">
          Drag &amp; drop a CSV with parent/child emails
        </p>
        <p className="mt-1 text-slate-500">
          or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-medium text-amber-400 hover:underline"
          >
            browse to upload
          </button>
        </p>
        <p className="mt-2 text-[11px] text-slate-500">
          Expected columns:{' '}
          <span className="font-mono text-slate-300">
            parent_email, child_email
          </span>
          . You can also use{' '}
          <span className="font-mono text-slate-300">parentEmail</span> /
          <span className="font-mono text-slate-300">childEmail</span>.
        </p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
        >
          <Download className="h-3 w-3" />
          Download CSV template
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="hidden grid-cols-[2fr,2fr,auto] gap-3 px-1 text-[10px] uppercase tracking-wider text-slate-500 sm:grid">
          <span>Parent email</span>
          <span>Child email</span>
          <span>Status</span>
        </div>
        {rows.map((row) => {
          const isLinked = row.status === 'linked';
          const isError = row.status === 'error';
          const isLinking = row.status === 'linking';

          return (
            <div
              key={row.id}
              className={`rounded-xl border bg-slate-900/80 p-3 text-xs transition-colors ${
                isLinked
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : isError
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr,2fr,auto]">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:hidden">
                    Parent email
                  </label>
                  <input
                    type="email"
                    value={row.parentEmail}
                    disabled={isLinked || isLinking}
                    onChange={(event) =>
                      updateRow(row.id, {
                        parentEmail: event.target.value,
                        status: 'idle',
                        message: undefined,
                      })
                    }
                    placeholder="parent@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:hidden">
                    Child email
                  </label>
                  <input
                    type="email"
                    value={row.childEmail}
                    disabled={isLinked || isLinking}
                    onChange={(event) =>
                      updateRow(row.id, {
                        childEmail: event.target.value,
                        status: 'idle',
                        message: undefined,
                      })
                    }
                    placeholder="student@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  {isLinking && (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  )}
                  {isLinked && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  {!isLinked && !isLinking && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="rounded-lg p-1 text-slate-600 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {isError && row.message && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-red-300">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{row.message}</span>
                </div>
              )}
              {isLinked && row.message && (
                <div className="mt-1 text-[11px] text-emerald-300">{row.message}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-700 px-3 py-1.5 text-[11px] text-slate-400 hover:border-slate-500 hover:text-slate-200"
        >
          Add manual row
        </button>
        <button
          type="button"
          onClick={handleLinkAll}
          disabled={submitting || rows.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Linking…
            </>
          ) : (
            <>
              <Link2 className="h-3 w-3" />
              Link {rows.length} pair{rows.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </section>
  );
}

