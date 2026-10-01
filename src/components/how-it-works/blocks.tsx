import { Fragment } from "react";
import type { Block } from "@/content/how-genesis-mesh-works";

/** Lets long CamelCase names (DelegatedAgreementRecord) wrap at word boundaries. */
export function BreakableName({ name }: { name: string }) {
  const parts = name.split(/(?<=[a-z])(?=[A-Z])/);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? <wbr /> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** Renders guide copy: paragraphs, small `text` diagrams, and quotes. */
export function Blocks({ blocks, className = "" }: { blocks: Block[]; className?: string }) {
  return (
    <div className={["grid gap-3", className].join(" ")}>
      {blocks.map((block, index) => {
        if (typeof block === "string") {
          return (
            <p key={index} className="text-[15px] leading-7 text-ink-300">
              {block}
            </p>
          );
        }

        if ("code" in block) {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-md border border-ink/10 bg-ink/[0.04] px-4 py-3 font-mono text-[13px] leading-6 whitespace-pre-wrap text-ink-200"
            >
              <code>{block.code.join("\n")}</code>
            </pre>
          );
        }

        return (
          <blockquote key={index} className="border-l-2 border-accent-ink/70 pl-4 text-[15px] leading-7 font-medium text-ink">
            {block.quote.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </blockquote>
        );
      })}
    </div>
  );
}
