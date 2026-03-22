import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  requestId?: string
  finalPoints?: number | string
  note?: string
  decidedBy?: string
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
    const { requestId, finalPoints, note, decidedBy }: Payload = await req.json()

    const cleanRequestId = String(requestId || '').trim()
    const parsedPoints = Number(finalPoints)
    const cleanNote = String(note || '').trim()
    const cleanDecidedBy = String(decidedBy || '').trim()

    if (!cleanRequestId) {
      return jsonResponse({ error: 'requestId obbligatorio' }, 400)
    }

    if (!Number.isFinite(parsedPoints)) {
      return jsonResponse({ error: 'finalPoints non valido' }, 400)
    }

    if (!cleanDecidedBy) {
      return jsonResponse({ error: 'decidedBy obbligatorio' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data, error } = await supabase
      .from('requests')
      .update({
        status: 'modified',
        final_points: parsedPoints,
        note: cleanNote,
        decided_by: cleanDecidedBy,
      })
      .eq('id', cleanRequestId)
      .eq('status', 'pending')
      .select('id, status, final_points, note, decided_by')
      .maybeSingle()

    if (error) {
      console.error('Errore modify-request:', error)
      return jsonResponse({ error: error.message || 'Errore database' }, 500)
    }

    if (!data) {
      return jsonResponse(
        { error: 'Richiesta non trovata o non più in stato pending' },
        404
      )
    }

    return jsonResponse({
      ok: true,
      request: data,
    })
  } catch (error) {
    console.error('Errore modify-request catch:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})