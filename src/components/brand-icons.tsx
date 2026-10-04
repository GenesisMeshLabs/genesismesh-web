import { BookOpen, Landmark, RadioTower } from "lucide-react";

type BrandIconProps = {
  name: "github" | "youtube" | "patreon" | "docs" | "live" | "thesis";
  className?: string;
};

export function BrandIcon({ name, className = "h-5 w-5" }: BrandIconProps) {
  if (name === "github") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.78 1.07.78 2.15v3.18c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.58 12 3.58 12 3.58s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.55 15.58V8.42L15.82 12l-6.27 3.58Z" />
      </svg>
    );
  }

  if (name === "patreon") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M14.82 2.5c-3.92 0-7.11 3.19-7.11 7.11s3.19 7.1 7.11 7.1 7.1-3.18 7.1-7.1-3.18-7.11-7.1-7.11ZM2.08 21.5h3.48v-19H2.08v19Z" />
      </svg>
    );
  }

  if (name === "live") {
    return <RadioTower className={className} aria-hidden="true" />;
  }

  if (name === "thesis") {
    return <Landmark className={className} aria-hidden="true" />;
  }

  return <BookOpen className={className} aria-hidden="true" />;
}
