import { HowItWorksExplorer } from "@/components/how-it-works/explorer";
import { PageShell } from "@/components/site-shell";
import { howItWorksPage } from "@/content/how-genesis-mesh-works";

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
        <div className="mt-10">
          <HowItWorksExplorer />
        </div>
        {children}
      </section>
    </PageShell>
  );
}
