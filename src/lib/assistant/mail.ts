// Sends a confirmed inquiry to the team mailbox over SMTP. MAIL_DRY_RUN=1 builds it without sending.
import nodemailer, { type Transporter } from "nodemailer";
import type { ChatMessage, Inquiry, InquiryField } from "./core";

let transport: Transporter | undefined;
function transporter(): Transporter {
  const port = Number(process.env.SMTP_PORT || 465);
  return (transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    // Fail fast instead of holding the function on a hung mail server.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  }));
}

export function mailConfigured(): boolean {
  return process.env.MAIL_DRY_RUN === "1" || Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

const LABELS: Record<InquiryField, string> = {
  topic: "Topic",
  name: "Name",
  email: "Email",
  organization: "Organization",
  message: "Message",
};

/** The last inquiry built in dry-run mode, for tests. */
export let lastDryRun: { inquiry: Inquiry; subject: string; text: string } | undefined;

export async function sendInquiry(inquiry: Inquiry, { page, transcript }: { page: string; transcript: ChatMessage[] }) {
  const fields = (Object.keys(LABELS) as InquiryField[])
    .filter((k) => inquiry[k])
    .map((k) => `${LABELS[k]}: ${inquiry[k]}`)
    .join("\n");
  const convo = transcript.map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`).join("\n\n");
  const subject = `Genesis Mesh inquiry: ${inquiry.topic} from ${inquiry.name}`.slice(0, 180);
  const text = `New inquiry from the www.genesismesh.org assistant\n\n${fields}\n\nPage: ${page || "-"}\n\n---\nConversation as submitted by the browser (unverified)\n\n${convo}`;
  if (process.env.MAIL_DRY_RUN === "1") {
    lastDryRun = { inquiry, subject, text };
    console.info(`inquiry dry run: ${subject}\n${text}`);
    return "dry-run";
  }
  const info = await transporter().sendMail({
    from: { name: "Genesis Mesh website", address: process.env.SMTP_USER! },
    to: process.env.MAIL_TO || process.env.SMTP_USER,
    replyTo: { name: inquiry.name!, address: inquiry.email! },
    subject,
    text,
  });
  return info.messageId as string;
}
