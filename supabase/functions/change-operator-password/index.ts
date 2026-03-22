import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  operatorId?: string
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
    const { operatorId, currentPassword, newPassword }: Payload = await req.json()

    const cleanOperatorId = String(operatorId || '').trim()
    const cleanCurrentPassword = String(currentPassword || '').trim()
    const cleanNewPassword = String(newPassword || '').trim()

    if (!cleanOperatorId) {
      return jsonResponse({ error: 'operatorId obbligatorio' }, 400)
    }

    if (!cleanCurrentPassword) {
      return jsonResponse({ error: 'Password attuale obbligatoria' }, 400)
    }

    if (!cleanNewPassword) {
      return jsonResponse({ error: 'Nuova password obbligatoria' }, 400)
    }

    if (cleanNewPassword.length < 4) {
      return jsonResponse({ error: 'La nuova password deve contenere almeno 4 caratteri' }, 400)
    }

    if (cleanNewPassword === cleanCurrentPassword) {
      return jsonResponse({ error: 'La nuova password deve essere diversa da quella attuale' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: operator, error: operatorError } = await supabase
      .from('operators')
      .select('id, password, active')
      .eq('id', cleanOperatorId)
      .maybeSingle()

    if (operatorError) {
      console.error('Errore query operator:', operatorError)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (!operator) {
      return jsonResponse({ error: 'Operatore non trovato' }, 404)
    }

    if (operator.active !== true) {
      return jsonResponse({ error: 'Operatore non attivo' }, 403)
    }

    const savedPassword = String(operator.password || '').trim()

    if (savedPassword !== cleanCurrentPassword) {
      return jsonResponse({ error: 'Password attuale non corretta' }, 401)
    }

    const { error: updateError } = await supabase
      .from('operators')
      .update({
        password: cleanNewPassword,
      })
      .eq('id', cleanOperatorId)

    if (updateError) {
      console.error('Errore update operator password:', updateError)
      return jsonResponse({ error: updateError.message || 'Errore aggiornamento password' }, 500)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    console.error('Errore change-operator-password:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})