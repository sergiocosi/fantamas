import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  boyId?: string
  newPassword?: string
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
    const { boyId, newPassword }: Payload = await req.json()

    const cleanBoyId = String(boyId || '').trim()
    const cleanNewPassword = String(newPassword || '').trim()

    if (!cleanBoyId) {
      return jsonResponse({ error: 'boyId obbligatorio' }, 400)
    }

    if (!cleanNewPassword) {
      return jsonResponse({ error: 'Nuova password obbligatoria' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data, error } = await supabase
      .from('boys')
      .update({ password: cleanNewPassword })
      .eq('id', cleanBoyId)
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('Errore reset-boy-password:', error)
      return jsonResponse({ error: error.message || 'Errore modifica password ragazzo' }, 500)
    }

    if (!data) {
      return jsonResponse({ error: 'Ragazzo non trovato' }, 404)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    console.error('Errore reset-boy-password catch:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})