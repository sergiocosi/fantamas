import { createClient } from 'npm:@supabase/supabase-js@2'

type LoginPayload = {
  username?: string
  password?: string
}

type VisitorRow = {
  id: string
  name: string | null
  username: string | null
  password: string | null
  active: boolean | null
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
    const { username, password }: LoginPayload = await req.json()

    const cleanUsername = String(username || '').trim().toLowerCase()
    const cleanPassword = String(password || '').trim()

    if (!cleanUsername || !cleanPassword) {
      return jsonResponse({ error: 'Username e password sono obbligatori' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data, error } = await supabase
      .from('visitors')
      .select('id, name, username, password, active')
      .eq('username', cleanUsername)
      .maybeSingle<VisitorRow>()

    if (error) {
      console.error('Errore query visitors:', error)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (!data) {
      return jsonResponse({ error: 'Credenziali visitatore non corrette' }, 401)
    }

    if (data.active !== true) {
      return jsonResponse({ error: 'Visitatore non attivo' }, 403)
    }

    const savedPassword = String(data.password || '').trim()

    if (savedPassword !== cleanPassword) {
      return jsonResponse({ error: 'Credenziali visitatore non corrette' }, 401)
    }

    return jsonResponse({
      ok: true,
      visitor: {
        id: data.id,
        name: data.name || 'Visitatore',
        username: data.username || cleanUsername,
        active: true,
      },
    })
  } catch (error) {
    console.error('Errore login-visitor:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})