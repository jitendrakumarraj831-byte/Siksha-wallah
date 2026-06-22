// Branded HTML email templates for Siksha Wallah.
// All templates share the same header/footer shell; only the body content differs.

const BRAND_COLOR = '#f97316';
const YEAR = new Date().getFullYear();

function shell(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation"
             style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);max-width:560px;width:100%;">

        <!-- ── Header ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;text-transform:uppercase;">
              Siksha<span style="color:#fff3cd;">Wallah</span>
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.88);font-size:13px;letter-spacing:0.08em;">
              शिक्षा का सही रास्ता
            </p>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="padding:36px 40px 28px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
              © ${YEAR} Siksha Wallah, Fatehgarh Sahib, Punjab.<br>
              यह एक automated message है — कृपया reply न करें।<br>
              <a href="https://sikshawallahfbg.in" style="color:${BRAND_COLOR};text-decoration:none;">sikshawallahfbg.in</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, url: string): string {
  return `<div style="text-align:center;margin:28px 0;">
    <a href="${url}"
       style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f97316);
              color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;
              padding:14px 40px;border-radius:10px;letter-spacing:0.02em;">
      ${label}
    </a>
  </div>`;
}

function fallbackLink(url: string): string {
  return `<p style="margin:20px 0 0;color:#94a3b8;font-size:12px;line-height:1.7;">
    Button काम नहीं कर रहा? नीचे दिया link copy करके browser में paste करें:<br>
    <a href="${url}" style="color:${BRAND_COLOR};word-break:break-all;">${url}</a>
  </p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">`;
}

// ── 1. Welcome / Registration ────────────────────────────────────────────────

export function welcomeTemplate(name: string, email: string): { html: string; text: string } {
  const html = shell(`
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:800;">
      Siksha Wallah में आपका स्वागत है, ${name}! 🎉
    </h2>
    <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.7;">
      आपका account successfully बन गया है। अब आप courses देख सकते हैं,
      admission के लिए apply कर सकते हैं, और हमारे expert counselors से
      guidance ले सकते हैं।
    </p>

    <table cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:10px;padding:16px 20px;margin:20px 0;width:100%;">
      <tr>
        <td style="color:#92400e;font-size:14px;line-height:1.7;">
          <strong>Account Details</strong><br>
          📧 Email: ${email}<br>
          🎓 Role: Student
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.7;">
      अगले steps:
    </p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
      <li>अपना email verify करें (verification link अलग email में आया है)</li>
      <li><a href="https://sikshawallahfbg.in/courses" style="color:${BRAND_COLOR};">Available courses</a> browse करें</li>
      <li>Admission form fill करें</li>
    </ul>

    ${ctaButton('अपना Dashboard खोलें', 'https://sikshawallahfbg.in/dashboard')}
    ${divider()}
    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
      कोई सवाल है? हमें call करें या WhatsApp करें।<br>
      हमारी team हमेशा आपकी मदद के लिए तैयार है।
    </p>
  `);

  const text = `Siksha Wallah में आपका स्वागत है, ${name}!

आपका account successfully बन गया है।
Email: ${email}

अगले steps:
1. अपना email verify करें
2. Courses browse करें: https://sikshawallahfbg.in/courses
3. Admission के लिए apply करें

Dashboard: https://sikshawallahfbg.in/dashboard

© ${YEAR} Siksha Wallah`;

  return { html, text };
}

// ── 2. Email Verification ────────────────────────────────────────────────────

export function verificationTemplate(name: string, verifyUrl: string): { html: string; text: string } {
  const html = shell(`
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:800;">
      अपना Email Verify करें
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      नमस्ते ${name},<br><br>
      नीचे दिए button पर click करके अपना email address verify करें।
      इससे आपका account fully activate हो जाएगा।
    </p>

    ${ctaButton('Email Verify करें', verifyUrl)}

    <table cellpadding="0" cellspacing="0" style="background:#fefce8;border-left:4px solid #f59e0b;padding:12px 16px;margin:20px 0;width:100%;box-sizing:border-box;">
      <tr>
        <td style="color:#713f12;font-size:13px;line-height:1.6;">
          ⏰ यह link <strong>24 घंटे</strong> में expire हो जाएगा।<br>
          अगर आपने account नहीं बनाया, तो इस email को ignore करें।
        </td>
      </tr>
    </table>

    ${fallbackLink(verifyUrl)}
  `);

  const text = `अपना Email Verify करें

नमस्ते ${name},

नीचे दिए link पर click करके अपना email verify करें:
${verifyUrl}

यह link 24 घंटे में expire हो जाएगा।

© ${YEAR} Siksha Wallah`;

  return { html, text };
}

// ── 3. Password Reset ────────────────────────────────────────────────────────

export function passwordResetTemplate(resetUrl: string): { html: string; text: string } {
  const html = shell(`
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:800;">
      Password Reset करें
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      हमें आपके account के लिए password reset request मिली है।
      नीचे दिए button पर click करके नया password set करें।
    </p>

    ${ctaButton('नया Password Set करें', resetUrl)}

    <table cellpadding="0" cellspacing="0" style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;margin:20px 0;width:100%;box-sizing:border-box;">
      <tr>
        <td style="color:#7f1d1d;font-size:13px;line-height:1.6;">
          ⏰ यह link <strong>1 घंटे</strong> में expire हो जाएगा।<br>
          अगर आपने यह request नहीं की, तो इस email को ignore करें —
          आपका account safe है।
        </td>
      </tr>
    </table>

    ${fallbackLink(resetUrl)}
  `);

  const text = `Password Reset करें

नीचे दिए link पर click करके नया password set करें:
${resetUrl}

यह link 1 घंटे में expire हो जाएगा।
अगर आपने request नहीं की तो इस email को ignore करें।

© ${YEAR} Siksha Wallah`;

  return { html, text };
}

// ── 4. Admission Confirmation ────────────────────────────────────────────────

export function admissionConfirmationTemplate(opts: {
  name: string;
  courseName: string;
  amount: number;
  paymentId: string;
  enrollmentDate: string;
}): { html: string; text: string } {
  const { name, courseName, amount, paymentId, enrollmentDate } = opts;
  const amountFormatted = `₹${amount.toLocaleString('en-IN')}`;

  const html = shell(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;">
        ✅
      </div>
    </div>

    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:800;text-align:center;">
      Admission Confirmed!
    </h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;text-align:center;">
      बधाई हो ${name}! आपका payment successful रहा और<br>
      आपका enrollment complete हो गया है।
    </p>

    <table cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;padding:20px 24px;margin:0 0 24px;width:100%;box-sizing:border-box;">
      <tr><td style="font-size:14px;color:#334155;line-height:2.2;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#64748b;width:50%;">Course</td>
            <td style="font-weight:700;color:#1e293b;">${courseName}</td>
          </tr>
          <tr>
            <td style="color:#64748b;">Amount Paid</td>
            <td style="font-weight:700;color:#16a34a;">${amountFormatted}</td>
          </tr>
          <tr>
            <td style="color:#64748b;">Payment ID</td>
            <td style="font-family:monospace;font-size:12px;color:#475569;">${paymentId}</td>
          </tr>
          <tr>
            <td style="color:#64748b;">Enrollment Date</td>
            <td style="color:#475569;">${enrollmentDate}</td>
          </tr>
          <tr>
            <td style="color:#64748b;">Status</td>
            <td><span style="background:#dcfce7;color:#166534;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:700;">Active</span></td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
      हमारी team जल्द आपसे contact करेगी। आप अपने dashboard पर
      enrollment details और अगले steps देख सकते हैं।
    </p>

    ${ctaButton('अपना Dashboard देखें', 'https://sikshawallahfbg.in/dashboard')}

    ${divider()}
    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
      किसी भी सहायता के लिए हमसे संपर्क करें:<br>
      📧 <a href="mailto:admission@sikshawallahfbg.in" style="color:${BRAND_COLOR};">admission@sikshawallahfbg.in</a>
    </p>
  `);

  const text = `Admission Confirmed!

बधाई हो ${name}! आपका enrollment complete हो गया है।

Course: ${courseName}
Amount Paid: ${amountFormatted}
Payment ID: ${paymentId}
Enrollment Date: ${enrollmentDate}
Status: Active

Dashboard: https://sikshawallahfbg.in/dashboard

Contact: admission@sikshawallahfbg.in
© ${YEAR} Siksha Wallah`;

  return { html, text };
}
