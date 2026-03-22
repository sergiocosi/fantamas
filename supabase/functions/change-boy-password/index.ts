import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  boyId?: string
  currentPassword?: string
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
    const { boyId, currentPassword, newPassword }: Payload = await req.json()

    const cleanBoyId = String(boyId || '').trim()
    const cleanCurrentPassword = String(currentPassword || '').trim()
    const cleanNewPassword = String(newPassword || '').trim()

    if (!cleanBoyId) {
      return jsonResponse({ error: 'boyId obbligatorio' }, 400)
    }

    if (!cleanCurrentPassword) {
      return jsonResponse({ error: 'Password attuale obbligatoria' }, 400)
    }

    if (!cleanNewPassword) {
      return jsonResponse({ error: 'Nuova password obbligatoria' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: boy, error: boyError } = await supabase
      .from('boys')
      .select('id, password')
      .eq('id', cleanBoyId)
      .maybeSingle()

    if (boyError) {
      console.error('Errore query boy:', boyError)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (!boy) {
      return jsonResponse({ error: 'Ragazzo non trovato' }, 404)
    }

    const savedPassword = String(boy.password || '').trim()

    if (savedPassword !== cleanCurrentPassword) {
      return jsonResponse({ error: 'Password attuale non corretta' }, 401)
    }

    const { error: updateError } = await supabase
      .from('boys')
      .update({ password: cleanNewPassword })
      .eq('id', cleanBoyId)

    if (updateError) {
      console.error('Errore update boy password:', updateError)
      return jsonResponse({ error: updateError.message || 'Errore cambio password' }, 500)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    console.error('Errore change-boy-password:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})