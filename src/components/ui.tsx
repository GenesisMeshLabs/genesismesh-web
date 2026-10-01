import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary" | "accent";
  icon?: React.ReactNode;
};

export function ButtonLink({
  href,
  children,
  external,
  variant = "primary",
  icon,
}: ButtonLinkProps) {
  const className =
    variant === "primary"
      ? "btn-primary"
      : variant === "accent"
        ? "btn-accent"
        : "btn-secondary";
  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {icon}
      {children}
      <Icon size={17} aria-hidden="true" />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  className = "max-w-3xl",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {description ? <p className="body-lead">{description}</p> : null}
    </div>
  );
}

export function CardIcon({
  icon: Icon,
  size = 24,
}: {
  icon: LucideIcon;
  size?: number;
}) {
  return (
    <div className="icon-tile">
      <Icon size={size} aria-hidden="true" />
    </div>
  );
}
