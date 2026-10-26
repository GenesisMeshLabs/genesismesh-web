"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUp, Check, MessageCircle, RotateCcw, X } from "lucide-react";
import { assistantContent as C } from "@/content/assistant";

// The website assistant: a launcher in the bottom-right corner and a chat panel (full screen on
// phones). The conversation is kept in sessionStorage, so it follows the visitor across pages.

type Summary = { fields: Record<string, string>; token: string; status?: "sent" };
type Msg = { role: "user" | "assistant"; content: string; quick?: string[]; summary?: Summary; local?: boolean };
type Stored = { messages: Msg[]; open: boolean; sent: boolean };
type Failure = "busy" | "offline" | "other";

const KEY = "gm-assistant-v1";
const SMALL = "(max-width: 639px)";

function load(): Stored {
  const empty: Stored = { messages: [], open: false, sent: false };
  if (typeof window === "undefined") return empty;
  try {
    const x = JSON.parse(sessionStorage.getItem(KEY) || "");
    if (Array.isArray(x?.messages)) {
      // Reopen after a reload on larger screens only; on phones the panel covers the page.
      return { messages: x.messages, sent: x.sent === true, open: x.open === true && !matchMedia(SMALL).matches };
    }
  } catch {
    // No stored conversation, or storage is unavailable.
  }
  return empty;
}

const noop = () => () => {};
function subscribeSmall(onChange: () => void) {
  const query = matchMedia(SMALL);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Links the assistant may turn clickable; anything else stays plain text.
const LINK_HOSTS = /^(?:[a-z0-9-]+\.)*genesismesh\.org$|^(?:www\.)?(?:youtube\.com|youtu\.be|patreon\.com|npmjs\.com|nuget\.org|pypi\.org)$|^(?:crates\.io|docs\.rs)$/;

function linkTarget(raw: string): { href: string; internal: boolean } | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase();
  const ours = host === "github.com" && /^\/GenesisMeshLabs(\/|$)/i.test(url.pathname);
  if (!ours && !LINK_HOSTS.test(host)) return null;
  if (host === "www.genesismesh.org") return { href: `${url.pathname}${url.search}${url.hash}`, internal: true };
  return { href: url.href, internal: false };
}

const INLINE = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"'`]+)/g;

function inline(text: string, onInternal: () => void): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    out.push(text.slice(last, m.index));
    last = m.index + m[0].length;
    const [, bold, code, label, labelHref, bare] = m;
    if (bold) out.push(<strong key={m.index} className="font-semibold text-ink">{bold}</strong>);
    else if (code) out.push(<code key={m.index} className="rounded bg-ink/10 px-1 py-0.5 font-mono text-[0.85em] text-ink">{code}</code>);
    else {
      // A bare URL keeps its trailing punctuation outside the link.
      let href = labelHref ?? bare;
      let tail = "";
      if (bare) {
        const trimmed = bare.replace(/[.,;:!?)\]]+$/, "");
        tail = bare.slice(trimmed.length);
        href = trimmed;
      }
      const target = linkTarget(href);
      const shown = label ?? href.replace(/^https?:\/\//, "");
      if (!target) out.push(label ? `${label} (${href})` : href);
      else if (target.internal) {
        out.push(
          <Link key={m.index} href={target.href} onClick={onInternal} className="font-semibold text-accent-ink underline underline-offset-2">
            {shown}
          </Link>,
        );
      } else {
        out.push(
          <a key={m.index} href={target.href} target="_blank" rel="noreferrer" className="font-semibold text-accent-ink underline underline-offset-2">
            {shown}
          </a>,
        );
      }
      if (tail) out.push(tail);
    }
  }
  out.push(text.slice(last));
  return out;
}

/** The assistant's plain-text replies: paragraphs, "- " and "1." lists, fenced code, **bold**, `code`, links. */
function Formatted({ text, onInternal }: { text: string; onInternal: () => void }) {
  const blocks: ReactNode[] = [];
  text.split(/```[\w-]*\n?([\s\S]*?)```/g).forEach((part, i) => {
    if (i % 2 === 1) {
      blocks.push(
        <pre key={`c${i}`} className="overflow-x-auto rounded-md bg-canvas p-3 font-mono text-xs leading-5 text-ink-200">
          {part.trimEnd()}
        </pre>,
      );
      return;
    }
    let list: { ordered: boolean; items: string[] } | null = null;
    const flush = (key: string) => {
      if (!list) return;
      const items = list.items.map((item, j) => <li key={j}>{inline(item, onInternal)}</li>);
      blocks.push(
        list.ordered ? (
          <ol key={key} className="list-decimal space-y-1 pl-5">{items}</ol>
        ) : (
          <ul key={key} className="list-disc space-y-1 pl-5">{items}</ul>
        ),
      );
      list = null;
    };
    part.split("\n").forEach((line, j) => {
      const bullet = line.match(/^\s*[-•*]\s+(.*)$/);
      const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const item = bullet?.[1] ?? numbered?.[1];
      if (item !== undefined) {
        const ordered = !bullet;
        if (list && list.ordered !== ordered) flush(`l${i}-${j}`);
        list ??= { ordered, items: [] };
        list.items.push(item);
        return;
      }
      flush(`l${i}-${j}`);
      if (line.trim()) blocks.push(<p key={`p${i}-${j}`}>{inline(line, onInternal)}</p>);
    });
    flush(`l${i}-end`);
  });
  return <div className="space-y-2 [overflow-wrap:anywhere]">{blocks}</div>;
}

function SummaryCard({
  summary,
  busy,
  onConfirm,
  onChange,
}: {
  summary: Summary;
  busy: boolean;
  onConfirm: () => void;
  onChange: () => void;
}) {
  const labels: Record<string, string> = C.summary.fields;
  return (
    <div className="mt-3 rounded-md border border-ink/15 bg-canvas p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">{C.summary.title}</p>
      <dl className="mt-2 grid gap-2 text-sm">
        {Object.keys(labels)
          .filter((k) => summary.fields[k])
          .map((k) => (
            <div key={k}>
              <dt className="text-xs text-ink-500">{labels[k]}</dt>
              <dd className="whitespace-pre-wrap text-ink-200 [overflow-wrap:anywhere]">{summary.fields[k]}</dd>
            </div>
          ))}
      </dl>
      {summary.status === "sent" ? (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-accent-ink">
          <Check size={16} aria-hidden="true" />
          {C.summary.sent}
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="rounded-md bg-accent px-3 py-2 text-sm font-bold text-on-accent transition hover:brightness-95 disabled:opacity-60"
            >
              {C.summary.confirm}
            </button>
            <button
              type="button"
              onClick={onChange}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink-200 transition hover:border-accent-ink/70"
            >
              {C.summary.change}
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-ink-500">{C.summary.note}</p>
        </>
      )}
    </div>
  );
}

const chip =
  "rounded-full border border-ink/15 bg-surface px-3 py-1.5 text-left text-xs font-semibold text-ink-200 transition hover:border-accent-ink/70 hover:text-ink";

export function ChatWidget() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const small = useSyncExternalStore(subscribeSmall, () => matchMedia(SMALL).matches, () => false);
  const [state, setState] = useState<Stored>(load);
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [armed, setArmed] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const { messages, open } = state;

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable: the conversation simply isn't kept across pages.
    }
  }, [state]);

  // Follow the conversation as it grows, and land on the latest message when the panel appears.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [mounted, messages.length, busy, failure, open]);

  // On phones the open panel covers the page: stop the page behind it from scrolling.
  useEffect(() => {
    if (!open || !small) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open, small]);

  useEffect(() => {
    if (open && !matchMedia("(pointer: coarse)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  if (!mounted) return null;

  const setOpen = (next: boolean) => {
    setState((s) => ({ ...s, open: next }));
    if (!next) requestAnimationFrame(() => launcherRef.current?.focus());
  };
  const closeOnPhone = () => {
    if (small) setOpen(false);
  };

  async function request(history: Msg[]) {
    setBusy(true);
    setFailure(null);
    const timer = setTimeout(() => setSlow(true), 8000);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(60_000),
        body: JSON.stringify({
          messages: history.map(({ role, content, summary }) => ({ role, content, summary: summary ? true : undefined })),
          page: location.pathname,
          sent: state.sent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) return setFailure("busy");
      if (!res.ok || (!data.reply && !data.summary)) throw new Error(String(res.status));
      const reply: Msg = { role: "assistant", content: data.reply || "", quick: data.quick, summary: data.summary };
      setState((s) => ({ ...s, messages: [...s.messages, reply] }));
    } catch {
      setFailure(navigator.onLine ? "other" : "offline");
    } finally {
      clearTimeout(timer);
      setSlow(false);
      setBusy(false);
    }
  }

  function send(text: string) {
    const content = text.trim().slice(0, 2000);
    if (!content || busy) return;
    const history: Msg[] = [...messages, { role: "user", content }];
    setState((s) => ({ ...s, messages: history }));
    request(history);
  }

  async function confirm(index: number) {
    const summary = messages[index]?.summary;
    if (!summary || summary.status || busy) return;
    setBusy(true);
    setFailure(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({ confirm: summary.token, messages: messages.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.submitted) {
        setState((s) => ({
          ...s,
          sent: true,
          messages: [
            ...s.messages.map((m, i) => (i === index && m.summary ? { ...m, summary: { ...m.summary, status: "sent" as const } } : m)),
            { role: "assistant", content: C.summary.sentReply, local: true },
          ],
        }));
      } else if (data.error === "expired") {
        setState((s) => ({ ...s, messages: [...s.messages, { role: "assistant", content: C.summary.expired, local: true }] }));
      } else setFailure(res.status === 429 ? "busy" : "other");
    } catch {
      setFailure(navigator.onLine ? "other" : "offline");
    } finally {
      setBusy(false);
    }
  }

  const prefill = (text: string) => {
    const input = inputRef.current;
    if (!input) return;
    input.value = text;
    input.focus();
    input.setSelectionRange(text.length, text.length);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input || busy || !input.value.trim()) return;
    const text = input.value;
    input.value = "";
    input.style.height = "";
    send(text);
  };

  const onInputKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const reset = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 4000);
      return;
    }
    setArmed(false);
    setFailure(null);
    setState((s) => ({ messages: [], open: s.open, sent: false }));
    inputRef.current?.focus();
  };

  const last = messages.at(-1);
  const quick = busy ? [] : messages.length ? (last?.role === "assistant" ? (last.quick ?? []) : []) : [...C.suggestions];

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls="gm-assistant"
          aria-label={C.launcher}
          className="fixed bottom-4 right-4 z-[55] inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-4 font-semibold text-on-accent shadow-xl shadow-black/30 transition hover:brightness-95 sm:bottom-6 sm:right-6 sm:px-5"
        >
          <MessageCircle size={22} aria-hidden="true" />
          <span className="hidden text-sm sm:inline">{C.launcher}</span>
        </button>
      )}
      {open && (
        <section
          id="gm-assistant"
          role="dialog"
          aria-modal={small || undefined}
          aria-labelledby="gm-assistant-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="fixed inset-0 z-[75] flex flex-col bg-surface text-ink sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100dvh-3rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-lg sm:border sm:border-ink/15 sm:shadow-2xl sm:shadow-black/40"
        >
          <header className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent">
              <MessageCircle size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="gm-assistant-title" className="truncate text-sm font-semibold text-ink">
                {C.title}
              </h2>
              <p className="truncate text-xs text-ink-400">{C.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label={armed ? C.resetConfirm : C.reset}
              title={armed ? C.resetConfirm : C.reset}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-ink/10 ${armed ? "bg-ink/10 text-accent-ink" : "text-ink-300"}`}
            >
              <RotateCcw size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={C.close}
              title={C.close}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink-300 transition hover:bg-ink/10"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 text-sm leading-6">
            <div className="max-w-[92%] rounded-lg rounded-tl-sm bg-ink/[0.06] px-3.5 py-2.5 text-ink-200">{C.welcome}</div>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-lg rounded-tr-sm bg-accent px-3.5 py-2.5 text-on-accent [overflow-wrap:anywhere]">
                  {m.content}
                </div>
              ) : (
                <div key={i} className="max-w-[92%] rounded-lg rounded-tl-sm bg-ink/[0.06] px-3.5 py-2.5 text-ink-200">
                  {m.content && <Formatted text={m.content} onInternal={closeOnPhone} />}
                  {m.summary && (
                    <SummaryCard
                      summary={m.summary}
                      busy={busy}
                      onConfirm={() => confirm(i)}
                      onChange={() => prefill(C.summary.changeText)}
                    />
                  )}
                </div>
              ),
            )}
            {busy && (
              <div className="w-fit rounded-lg rounded-tl-sm bg-ink/[0.06] px-3.5 py-2.5" role="status" aria-label={C.thinking}>
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 150, 300].map((delay) => (
                    <i key={delay} className="h-2 w-2 animate-bounce rounded-full bg-ink-400" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </span>
                {slow && <small className="mt-1 block text-xs text-ink-400">{C.still}</small>}
              </div>
            )}
            {failure && (
              <div className="max-w-[92%] rounded-lg rounded-tl-sm border border-ink/15 px-3.5 py-2.5 text-ink-300">
                <p>{C.errors[failure]}</p>
                {failure !== "busy" && last?.role === "user" && (
                  <button type="button" onClick={() => request(messages)} className={`${chip} mt-2`}>
                    {C.errors.retry}
                  </button>
                )}
              </div>
            )}
            {quick.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)} className={chip}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-ink/10 px-3 pt-3">
            <textarea
              ref={inputRef}
              rows={1}
              maxLength={2000}
              dir="auto"
              placeholder={C.placeholder}
              aria-label={C.placeholder}
              onKeyDown={onInputKey}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "";
                el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
              }}
              className="max-h-[140px] min-h-10 flex-1 resize-none rounded-md border border-ink/15 bg-canvas px-3 py-2 text-base text-ink outline-none placeholder:text-ink-500 focus:border-accent-ink/70 sm:text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label={C.send}
              title={C.send}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent transition hover:brightness-95 disabled:opacity-50"
            >
              <ArrowUp size={18} aria-hidden="true" />
            </button>
          </form>
          <p className="px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 text-[11px] leading-4 text-ink-500">{C.privacy}</p>
        </section>
      )}
    </>
  );
}
