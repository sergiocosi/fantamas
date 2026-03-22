import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  boyId?: string
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
    const { boyId }: Payload = await req.json()

    const cleanBoyId = String(boyId || '').trim()

    if (!cleanBoyId) {
      return jsonResponse({ error: 'boyId obbligatorio' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: boy, error: boyError } = await supabase
      .from('boys')
      .select('id, name')
      .eq('id', cleanBoyId)
      .maybeSingle()

    if (boyError) {
      console.error('Errore query boy:', boyError)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (!boy) {
      return jsonResponse({ error: 'Ragazzo non trovato' }, 404)
    }

    const { error: requestsError } = await supabase
      .from('requests')
      .delete()
      .eq('user_id', cleanBoyId)

    if (requestsError) {
      console.error('Errore delete requests boy:', requestsError)
      return jsonResponse({ error: requestsError.message || 'Errore eliminazione movimenti ragazzo' }, 500)
    }

    const { data: deletedBoy, error: deleteBoyError } = await supabase
      .from('boys')
      .delete()
      .eq('id', cleanBoyId)
      .select('id')
      .maybeSingle()

    if (deleteBoyError) {
      console.error('Errore delete boy:', deleteBoyError)
      return jsonResponse({ error: deleteBoyError.message || 'Errore eliminazione ragazzo' }, 500)
    }

    if (!deletedBoy) {
      return jsonResponse({ error: 'Ragazzo non eliminato' }, 500)
    }

    return jsonResponse({
      ok: true,
      deletedId: deletedBoy.id,
    })
  } catch (error) {
    console.error('Errore delete-boy:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})