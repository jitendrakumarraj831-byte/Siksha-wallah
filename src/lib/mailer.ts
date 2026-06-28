import nodemailer, { type Transporter } from 'nodemailer';

let _transporter: Transporter | null = null;

function createTransporter(): Transporter {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Fail fast in serverless: if the SMTP port is blocked or the host is slow,
    // don't let the function hang — error out so the caller can fall back to
    // Firebase's built-in sender instead of leaving the user with nothing.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export function getMailer(): Transporter {
  if (!_transporter) _transporter = createTransporter();
  return _transporter;
}

export function isMailerConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

// Live SMTP connectivity/auth check (used by the diagnostic endpoint). Returns
// a plain result instead of throwing so callers can report it safely.
export async function verifyMailer(): Promise<{ ok: boolean; error?: string }> {
  try {
    await getMailer().verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Non-secret view of the SMTP configuration for diagnostics.
export function smtpConfigShape(): Record<string, unknown> {
  return {
    configured: isMailerConfigured(),
    host: process.env.SMTP_HOST ?? null,
    port: process.env.SMTP_PORT ?? "465 (default)",
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    hasUser: !!process.env.SMTP_USER,
    hasPass: !!process.env.SMTP_PASS,
    from: EMAIL_FROM(),
  };
}

export const EMAIL_FROM = () =>
  process.env.EMAIL_FROM ?? 'admission@sikshawallahfbg.in';

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  try {
    await getMailer().sendMail({
      from: `"Siksha Wallah" <${EMAIL_FROM()}>`,
      ...opts,
    });
  } catch (err) {
    console.error('[SMTP] sendMail failed — host=%s port=%s user=%s to=%s subject=%s error:',
      process.env.SMTP_HOST,
      process.env.SMTP_PORT,
      process.env.SMTP_USER,
      opts.to,
      opts.subject,
      err,
    );
    throw err;
  }
}
