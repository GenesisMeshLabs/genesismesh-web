import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";
import { DesktopNav, MobileNav } from "@/components/site-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { externalChannels, siteLinks } from "@/content/site";

function BrandLogo({ size, alt, priority }: { size: number; alt: string; priority?: boolean }) {
  return (
    <>
      <Image
        src="/images/brand/logo-reverse.svg"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="theme-dark-only"
      />
      <Image
        src="/images/brand/logo.svg"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="theme-light-only"
      />
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/90 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={34} alt="Genesis Mesh" priority />
          <span className="text-sm font-semibold tracking-wide text-ink">Genesis Mesh</span>
        </Link>
        <DesktopNav />
        <div className="flex items-center gap-2">
          <a
            href={siteLinks.githubOrg}
            className="hidden h-10 items-center gap-2 rounded-md border border-ink/20 bg-ink/[0.07] px-4 text-sm font-semibold text-ink transition hover:border-ink/40 hover:bg-ink/15 lg:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            <BrandIcon name="github" className="h-4 w-4" />
            GitHub
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-canvas">
      <div className="site-container grid gap-8 py-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo size={32} alt="" />
            <p className="font-semibold text-ink">Genesis Mesh</p>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-400">
            Portable trust for sovereign systems. Open infrastructure for recognition,
            revocation, evidence, and protocol interoperability.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {externalChannels.map((channel) => (
            <a
              key={channel.href}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md border border-ink/10 bg-ink/[0.03] px-3 py-2 text-sm text-ink-300 transition hover:border-accent-ink/60 hover:text-ink"
            >
              <BrandIcon name={channel.icon} className="h-4 w-4" />
              {channel.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
