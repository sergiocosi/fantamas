import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  requestId?: string
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return jsonResponse({ ok: true }, 200)
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const { requestId }: Payload = await req.json()

    const cleanRequestId = String(requestId || '').trim()

    if (!cleanRequestId) {
      return jsonResponse({ error: 'requestId obbligatorio' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data, error } = await supabase
      .from('requests')
      .delete()
      .eq('id', cleanRequestId)
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('Errore delete-request:', error)
      return jsonResponse({ error: error.message || 'Errore database' }, 500)
    }

    if (!data) {
      return jsonResponse({ error: 'Movimento non trovato' }, 404)
    }

    return jsonResponse({
      ok: true,
      deletedId: data.id,
    })
  } catch (error) {
    console.error('Errore delete-request catch:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})