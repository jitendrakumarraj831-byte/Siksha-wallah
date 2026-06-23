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
  });
}

export function getMailer(): Transporter {
  if (!_transporter) _transporter = createTransporter();
  return _transporter;
}

export function isMailerConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
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
