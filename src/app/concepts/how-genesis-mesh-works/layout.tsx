import { HowItWorksExplorer } from "@/components/how-it-works/explorer";
import { PageShell } from "@/components/site-shell";
import Link from "next/link";
import { howItWorksPage, whereToStart } from "@/content/how-genesis-mesh-works";

/**
 * Shared by the Foundation, Governed Action, and Full Model routes. Because
 * the explorer lives in the layout it stays mounted while the route changes,
 * so switching views animates the one map instead of loading a new page.
 */
export default function HowGenesisMeshWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell>
      <section className="page-section relative">
        <header className="max-w-3xl">
          <p className="section-eyebrow">{howItWorksPage.eyebrow}</p>
          <h1 className="page-title">{howItWorksPage.title}</h1>
          <p className="body-lead">{howItWorksPage.lead}</p>
        </header>
        <nav
          aria-label={whereToStart.title}
          className="mt-6 flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-ink/10 bg-surface px-4 py-3 text-sm"
        >
          <span className="font-semibold uppercase tracking-[0.14em] text-accent-ink">{whereToStart.title}</span>
          {whereToStart.steps.map((step, index) => (
            <Link
              key={step.href}
              href={step.href}
              {...(step.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="text-ink-200 hover:text-ink hover:underline"
            >
              {index + 1}. {step.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10">
          <HowItWorksExplorer />
        </div>
        {children}
      </section>
    </PageShell>
  );
}
