import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  boyId?: string
  name?: string
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
    const { boyId, name }: Payload = await req.json()

    const cleanBoyId = String(boyId || '').trim()
    const cleanName = String(name || '').trim()

    if (!cleanBoyId) {
      return jsonResponse({ error: 'boyId obbligatorio' }, 400)
    }

    if (!cleanName) {
      return jsonResponse({ error: 'Nome obbligatorio' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: duplicateBoy, error: duplicateError } = await supabase
      .from('boys')
      .select('id, name')
      .neq('id', cleanBoyId)
      .ilike('name', cleanName)
      .maybeSingle()

    if (duplicateError) {
      console.error('Errore controllo duplicato boy:', duplicateError)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (duplicateBoy) {
      return jsonResponse({ error: 'Esiste già un ragazzo con questo nome' }, 409)
    }

    const { data: updatedBoy, error: boyError } = await supabase
      .from('boys')
      .update({ name: cleanName })
      .eq('id', cleanBoyId)
      .select('id, name')
      .maybeSingle()

    if (boyError) {
      console.error('Errore update boy:', boyError)
      return jsonResponse({ error: boyError.message || 'Errore modifica ragazzo' }, 500)
    }

    if (!updatedBoy) {
      return jsonResponse({ error: 'Ragazzo non trovato' }, 404)
    }

    const { error: requestsError } = await supabase
      .from('requests')
      .update({ user_name: cleanName })
      .eq('user_id', cleanBoyId)

    if (requestsError) {
      console.error('Errore update requests user_name:', requestsError)
      return jsonResponse({ error: requestsError.message || 'Errore aggiornamento richieste' }, 500)
    }

    return jsonResponse({
      ok: true,
      boy: updatedBoy,
    })
  } catch (error) {
    console.error('Errore update-boy:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})