import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  requestId?: string
  action?: 'approve' | 'reject'
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
    const { requestId, action, decidedBy }: Payload = await req.json()

    const cleanRequestId = String(requestId || '').trim()
    const cleanAction = String(action || '').trim()
    const cleanDecidedBy = String(decidedBy || '').trim()

    if (!cleanRequestId) {
      return jsonResponse({ error: 'requestId obbligatorio' }, 400)
    }

    if (cleanAction !== 'approve' && cleanAction !== 'reject') {
      return jsonResponse({ error: 'action non valida' }, 400)
    }

    if (!cleanDecidedBy) {
      return jsonResponse({ error: 'decidedBy obbligatorio' }, 400)
    }

    const payload =
      cleanAction === 'approve'
        ? {
            status: 'approved',
            decided_by: cleanDecidedBy,
            note: '',
          }
        : {
            status: 'rejected',
            decided_by: cleanDecidedBy,
            note: 'Non confermato',
          }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data, error } = await supabase
      .from('requests')
      .update(payload)
      .eq('id', cleanRequestId)
      .eq('status', 'pending')
      .select('id, status, decided_by, note')
      .maybeSingle()

    if (error) {
      console.error('Errore decisione richiesta:', error)
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
    console.error('Errore decide-request:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})