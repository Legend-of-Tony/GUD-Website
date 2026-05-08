const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type QuoteRequestPayload = {
  fullName?: string
  phone?: string
  email?: string
  service?: string
  description?: string
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const quoteToEmail = Deno.env.get('QUOTE_TO_EMAIL')
  const quoteFromEmail = Deno.env.get('QUOTE_FROM_EMAIL')

  if (!resendApiKey || !quoteToEmail || !quoteFromEmail) {
    return jsonResponse(
      {
        error:
          'Missing function environment variables. Set RESEND_API_KEY, QUOTE_TO_EMAIL, and QUOTE_FROM_EMAIL before testing.',
      },
      500
    )
  }

  try {
    const payload = (await request.json()) as QuoteRequestPayload
    const { fullName, phone, email, service, description } = payload

    if (!fullName || !phone || !email || !service || !description) {
      return jsonResponse({ error: 'All quote request fields are required.' }, 400)
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: quoteFromEmail,
        to: [quoteToEmail],
        reply_to: email,
        subject: `New quote request: ${service}`,
        html: renderQuoteRequestEmail({ fullName, phone, email, service, description }),
      }),
    })

    const responseData = await resendResponse.json().catch(() => null)

    if (!resendResponse.ok) {
      return jsonResponse(
        {
          error:
            typeof responseData === 'object' && responseData && 'message' in responseData
              ? String(responseData.message)
              : 'Resend could not send the quote request email.',
        },
        502
      )
    }

    return jsonResponse({ success: true }, 200)
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unknown error.' }, 500)
  }
})

function renderQuoteRequestEmail({
  fullName,
  phone,
  email,
  service,
  description,
}: Required<QuoteRequestPayload>) {
  const escapedDescription = escapeHtml(description).replace(/\n/g, '<br />')

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h1 style="margin-bottom: 16px;">New Quote Request</h1>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Service Needed:</strong> ${escapeHtml(service)}</p>
      <p><strong>Project Description:</strong></p>
      <p>${escapedDescription}</p>
    </div>
  `
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}
