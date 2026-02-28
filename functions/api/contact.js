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
    text: `Hi ${name},

Thanks for contacting me through my portfolio. I received your message and I'll get back to you as soon as I can, usually within 24-48 hours.

Your message summary:
"${messagePreview(message)}"

If your request is urgent, you can also reach me directly at ${toEmail}.

Best regards,
Angeles Kian Charles`,
  };

  try {
    await sendResendEmail(resendApiKey, ownerEmailPayload);
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Unable to send message";
    return json({ success: false, message: `Owner email failed: ${messageText}` }, 500);
  }

  try {
    await sendResendEmail(resendApiKey, autoReplyPayload);
    return json({ success: true, message: "Message sent. I will get back to you soon." }, 200);
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Auto-reply failed";
    return json(
      {
        success: true,
        autoReplySent: false,
        message: `Message delivered, but auto-reply could not be sent: ${messageText}`,
      },
      200
    );
  }
}
