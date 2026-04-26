import { ListOrdered } from "lucide-react";
import type { BlogHeading } from "@/lib/blog";

type Props = {
  headings: BlogHeading[];
};

export function TableOfContents({ headings }: Props) {
  if (headings.length === 0) return null;

  return (
    <nav
      className="not-prose my-10 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 sm:p-6"
      aria-label="この記事の目次"
    >
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-slate-900">
          <span className="inline-flex items-center gap-2 text-base sm:text-lg font-bold">
            <ListOrdered className="h-5 w-5 text-primary" aria-hidden="true" />
            この記事の目次
          </span>
          <span className="text-xs font-medium text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </summary>
        <ol className="mt-4 space-y-2 border-t border-primary-100 pt-4">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className="group/item flex items-baseline gap-2 text-sm sm:text-[15px] leading-relaxed text-slate-700 transition-colors hover:text-primary"
              >
                <span className="text-primary/70 group-hover/item:text-primary" aria-hidden="true">
                  ▸
                </span>
                <span className="flex-1">{heading.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
