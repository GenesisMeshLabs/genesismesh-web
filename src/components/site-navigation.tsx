"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";
import { navItems, siteLinks, type NavItem } from "@/content/site";

function isActivePath(pathname: string, { href, activePrefix }: NavItem) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || (activePrefix !== undefined && pathname.startsWith(activePrefix));
}

function isExternal(href: string) {
  return href.startsWith("http");
}

function externalProps(href: string) {
  return isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {};
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 text-sm whitespace-nowrap text-ink-300 lg:flex">
      {navItems.map((item) => {
        const active = isActivePath(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            {...externalProps(item.href)}
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-md px-3 py-2 transition",
              active
                ? "bg-accent text-on-accent"
                : "hover:bg-ink/10 hover:text-ink",
            ].join(" ")}
          >
            {item.label}
            {isExternal(item.href) ? (
              <ArrowUpRight className="ml-0.5 inline" size={13} aria-hidden="true" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <details className="group relative lg:hidden">
      <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-ink/15 bg-ink/10 text-ink transition hover:border-accent-ink/70 [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Open navigation menu</span>
        <Menu size={20} aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-12 w-64 rounded-md border border-ink/10 bg-surface p-2 shadow-2xl shadow-black/50">
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item);

            return (
              <Link
                key={item.href}
                href={item.href}
                {...externalProps(item.href)}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-md px-3 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-accent text-on-accent"
                    : "text-ink-200 hover:bg-ink/10 hover:text-ink",
                ].join(" ")}
              >
                {item.label}
                {isExternal(item.href) ? (
                  <ArrowUpRight className="ml-1 inline" size={14} aria-hidden="true" />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <a
          href={siteLinks.githubOrg}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center justify-between rounded-md bg-tile px-3 py-3 text-sm font-bold text-on-accent transition hover:bg-accent"
        >
          <span className="inline-flex items-center gap-2">
            <BrandIcon name="github" className="h-4 w-4" />
            GitHub
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </details>
  );
}
