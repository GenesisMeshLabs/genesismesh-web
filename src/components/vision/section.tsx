import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { VisionSource } from "@/content/vision/sources";

export function VisionSection({ id, eyebrow, title, children }: {
  id: string; eyebrow: string; title: string; children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="vision-section border-t border-ink/10">
      <div className="page-section">
        <div className="max-w-4xl">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 id={`${id}-heading`} className="section-title">{title}</h2>
        </div>
        <div className="mt-8 space-y-8">{children}</div>
      </div>
    </section>
  );
}

export function Copy({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <p className={muted ? "muted-copy max-w-4xl" : "vision-copy"}>{children}</p>;
}

export function TextList({ items }: { items: string[] }) {
  return <ul className="vision-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="vision-source inline-flex items-baseline gap-1">
    <span>{children}</span><ArrowUpRight size={16} className="shrink-0 self-center" aria-hidden="true" />
  </a>;
}

export function SourceLinks({ sources }: { sources: VisionSource[] }) {
  return (
    <ul aria-label="Supporting sources" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
      {sources.map((source) => (
        <li key={source.href}>
          <SourceLink href={source.href}>{source.label}</SourceLink>
        </li>
      ))}
    </ul>
  );
}

export function Cards({ items }: { items: { title: string; description: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => <article className="soft-card p-6" key={item.title}>
        <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-ink-300">{item.description}</p>
      </article>)}
    </div>
  );
}
