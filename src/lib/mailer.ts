import nodemailer, { type Transporter } from 'nodemailer';

let _transporter: Transporter | null = null;

// Read an env var, trimming whitespace and a single pair of wrapping quotes.
// Stray spaces/quotes creep in when values are pasted into a hosting dashboard
// (Vercel etc.) and are a very common cause of "535 authentication failed"
// even when the value looks correct at a glance.
function cleanEnv(v: string | undefined): string | undefined {
  if (v == null) return undefined;
  let s = v.trim();
  if (s.length >= 2 && ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))) {
    s = s.slice(1, -1);
  }
  return s;
}

function createTransporter(): Transporter {
  const port = Number(cleanEnv(process.env.SMTP_PORT) ?? 465);
  // Honour an explicit SMTP_SECURE flag if provided; otherwise default by port
  // (465 = implicit TLS, 587 = STARTTLS).
  const secureEnv = cleanEnv(process.env.SMTP_SECURE);
  const secure = secureEnv ? secureEnv.toLowerCase() === 'true' : port === 465;
  return nodemailer.createTransport({
    host: cleanEnv(process.env.SMTP_HOST),
    port,
    secure,
    auth: {
      user: cleanEnv(process.env.SMTP_USER),
      pass: cleanEnv(process.env.SMTP_PASS),
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
  return !!(cleanEnv(process.env.SMTP_HOST) && cleanEnv(process.env.SMTP_USER) && cleanEnv(process.env.SMTP_PASS));
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
  const user = cleanEnv(process.env.SMTP_USER);
  const from = EMAIL_FROM();
  return {
    configured: isMailerConfigured(),
    host: cleanEnv(process.env.SMTP_HOST) ?? null,
    port: cleanEnv(process.env.SMTP_PORT) ?? "465 (default)",
    secure: cleanEnv(process.env.SMTP_SECURE)
      ? cleanEnv(process.env.SMTP_SECURE)!.toLowerCase() === "true"
      : Number(cleanEnv(process.env.SMTP_PORT) ?? 465) === 465,
    hasUser: !!user,
    user: user ?? null,
    hasPass: !!cleanEnv(process.env.SMTP_PASS),
    from,
    fromMatchesUser: !!user && from.toLowerCase() === user.toLowerCase(),
  };
}

// Deep, SECRET-SAFE diagnostics for the 535 investigation. Never returns the
// password itself — only its shape — plus the exact values Nodemailer resolves
// and which env-var NAMES are actually present in the environment.
export function smtpDiagnostics(): Record<string, unknown> {
  const rawUser = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS;
  const cleanedUser = cleanEnv(rawUser);
  const cleanedPass = cleanEnv(rawPass);

  // Names only (never values) of every mail-related env var actually set. This
  // catches mistakes like SMTP_PASSWORD instead of SMTP_PASS, MAIL_USER, typos.
  const presentMailEnvNames = Object.keys(process.env)
    .filter((k) => /smtp|mail|email/i.test(k))
    .sort();

  const passShape = rawPass == null
    ? { present: false }
    : {
        present: true,
        rawLength: rawPass.length,
        cleanedLength: cleanedPass?.length ?? 0,
        trimmedQuotesOrSpaces: rawPass.length !== (cleanedPass?.length ?? 0),
        hasLeadingWhitespace: /^\s/.test(rawPass),
        hasTrailingWhitespace: /\s$/.test(rawPass),
        hasInnerWhitespace: /\s/.test(cleanedPass ?? ""),
        hasNonAscii: /[^\x20-\x7E]/.test(cleanedPass ?? ""),
      };

  const userShape = rawUser == null
    ? { present: false }
    : {
        present: true,
        resolved: cleanedUser ?? null,
        trimmedQuotesOrSpaces: rawUser.length !== (cleanedUser?.length ?? 0),
        looksLikeEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedUser ?? ""),
      };

  // Exactly what createTransporter() feeds Nodemailer — same code path.
  const port = Number(cleanEnv(process.env.SMTP_PORT) ?? 465);
  const secureEnv = cleanEnv(process.env.SMTP_SECURE);
  const resolved = {
    host: cleanEnv(process.env.SMTP_HOST) ?? null,
    port,
    secure: secureEnv ? secureEnv.toLowerCase() === "true" : port === 465,
    user: cleanedUser ?? null,
    authMethod: "LOGIN/PLAIN (Nodemailer default)",
  };

  return {
    resolvedNodemailerAuth: resolved,
    fromAddress: EMAIL_FROM(),
    presentMailEnvNames,
    readsTheseVarNames: {
      host: "SMTP_HOST",
      port: "SMTP_PORT",
      secure: "SMTP_SECURE",
      user: "SMTP_USER",
      pass: "SMTP_PASS",
      from: "EMAIL_FROM (or FROM_EMAIL, else SMTP_USER)",
    },
    userShape,
    passShape,
  };
}

// From address. Supports both EMAIL_FROM and FROM_EMAIL names, and defaults to
// the authenticated SMTP user — Titan rejects sends whose From doesn't match the
// authenticated mailbox, so keeping them aligned avoids a separate failure.
export const EMAIL_FROM = () =>
  cleanEnv(process.env.EMAIL_FROM) ??
  cleanEnv(process.env.FROM_EMAIL) ??
  cleanEnv(process.env.SMTP_USER) ??
  'admission@sikshawallahfbg.in';

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
