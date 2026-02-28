const RESEND_API_URL = "https://api.resend.com/emails";

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function normalize(value) {
  return String(value || "").trim();
}

function messagePreview(text, maxLength = 500) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildAutoReplyHtml({ name, preview, toEmail, siteUrl, logoUrl }) {
  const safeName = escapeHtml(name);
  const safePreview = escapeHtml(preview).replaceAll("\n", "<br />");
  const safeToEmail = escapeHtml(toEmail);
  const safeSiteUrl = escapeHtml(siteUrl);
  const safeLogoUrl = escapeHtml(logoUrl);

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thanks for reaching out</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:30px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
            <tr>
              <td style="padding:26px 30px 18px 30px;border-bottom:1px solid #e2e8f0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="width:72px;vertical-align:middle;">
                      <img src="${safeLogoUrl}" alt="Kian Angeles Logo" width="56" height="56" style="display:block;border-radius:8px;" />
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0 0 2px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Portfolio Contact</p>
                      <h1 style="margin:0;font-size:24px;line-height:1.25;color:#0f172a;">Thanks for reaching out, ${safeName}</h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 30px 8px 30px;font-size:15px;line-height:1.7;color:#1e293b;">
                <p style="margin:0 0 12px 0;">Your message has been received successfully. I will review it and get back to you as soon as possible, typically within 24-48 hours.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0 14px 0;border:1px solid #dbe4ef;border-radius:10px;background:#f8fafc;">
                  <tr>
                    <td style="padding:14px 16px 6px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#475569;">
                      Message Summary
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 16px 16px 16px;font-size:14px;color:#334155;">
                  ${safePreview}
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 14px 0;">For urgent concerns, email me directly at <a href="mailto:${safeToEmail}" style="color:#0f172a;text-decoration:none;font-weight:600;">${safeToEmail}</a>.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 30px 24px 30px;">
                <a href="${safeSiteUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:600;padding:11px 16px;border-radius:8px;">Visit My Portfolio</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 30px 22px 30px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
                Best regards,<br />
                <span style="font-weight:600;color:#334155;">Angeles Kian Charles</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendResendEmail(apiKey, payload) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Resend request failed";
    try {
      const data = await response.json();
      errorMessage = data?.message || data?.error || JSON.stringify(data);
    } catch {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ success: false, message: "Method not allowed" }, 405);
  }

  const resendApiKey = context.env.RESEND_API_KEY;
  const toEmail = context.env.CONTACT_TO_EMAIL;
  const fromEmail = context.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return json({ success: false, message: "Server email settings are not configured" }, 500);
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ success: false, message: "Invalid JSON payload" }, 400);
  }

  const name = normalize(body?.name);
  const email = normalize(body?.email);
  const message = normalize(body?.message);
  const siteUrl = new URL(context.request.url).origin;
  const logoUrl = `${siteUrl}/logo.png`;
  const messageSummary = messagePreview(message);

  if (!name || !email || !message) {
    return json({ success: false, message: "Name, email, and message are required" }, 400);
  }

  const ownerEmailPayload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: email,
    subject: `Portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  };

  const autoReplyPayload = {
    from: fromEmail,
    to: [email],
    subject: `Thanks for reaching out, ${name}`,
    html: buildAutoReplyHtml({
      name,
      preview: messageSummary,
      toEmail,
      siteUrl,
      logoUrl,
    }),
    text: `Hi ${name},

Thanks for contacting me through my portfolio. I received your message and I'll get back to you as soon as I can, usually within 24-48 hours.

Your message summary:
"${messageSummary}"

If your request is urgent, you can also reach me directly at ${toEmail}.

Best regards,
Angeles Kian Charles`,
  };

  try {
    await sendResendEmail(resendApiKey, ownerEmailPayload);
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Unable to send message";
    console.error("Contact owner email failed:", messageText);
    return json(
      { success: false, message: "Message failed to send. Please try again or email me directly." },
      500
    );
  }

  try {
    await sendResendEmail(resendApiKey, autoReplyPayload);
    return json({ success: true, message: "Message sent. I will get back to you soon." }, 200);
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Auto-reply failed";
    console.error("Contact auto-reply failed:", messageText);
    return json(
      {
        success: true,
        autoReplySent: false,
        message:
          "Message sent. I will get back to you soon. If you do not receive a confirmation email yet, your message was still delivered.",
      },
      200
    );
  }
}
