// Dependency-free CSV export for the office portal. Runs client-side on a button
// click (uses Blob + a temporary anchor), so it works with the already-loaded,
// already-filtered data — no backend call and no new dependency.

const BOM = "﻿"; // UTF-8 BOM so Excel renders Hindi/Unicode (नाम, courses) correctly.

function escapeCell(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  // Quote if the value contains a comma, quote, or newline; double embedded quotes.
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export interface CsvColumn<T> {
  /** Property to read when no `value` is supplied. */
  key?: keyof T | string;
  /** Column header text. */
  label: string;
  /** Optional formatter for derived/formatted cells (dates, counts, …). */
  value?: (row: T) => unknown;
}

/** Pure CSV string builder (no DOM) — unit-testable. Prepends a UTF-8 BOM. */
export function buildCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) =>
          escapeCell(
            c.value ? c.value(row) : c.key ? (row as Record<string, unknown>)[c.key as string] : "",
          ),
        )
        .join(","),
    )
    .join("\r\n");
  return BOM + header + "\r\n" + body;
}

/**
 * Build a CSV from `rows` using `columns` and trigger a browser download.
 */
export function exportToCsv<T>(
  filename: string,
  columns: CsvColumn<T>[],
  rows: T[],
): void {
  const csv = buildCsv(columns, rows);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** `inquiries-2026-06-26.csv` style filename. */
export function datedFilename(prefix: string): string {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.csv`;
}
