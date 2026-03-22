import { createClient } from 'npm:@supabase/supabase-js@2'

type LoginPayload = {
  username?: string
  password?: string
}

type BoyRow = {
  id: string
  name: string | null
  username: string | null
  password: string | null
  avatar_key: string | null
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
      .from('boys')
      .select('id, name, username, password, avatar_key')
      .eq('username', cleanUsername)
      .maybeSingle<BoyRow>()

    if (error) {
      console.error('Errore query boys:', error)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (!data) {
      return jsonResponse({ error: 'Credenziali ragazzo non corrette' }, 401)
    }

    const savedPassword = String(data.password || '').trim()

    if (savedPassword !== cleanPassword) {
      return jsonResponse({ error: 'Credenziali ragazzo non corrette' }, 401)
    }

    return jsonResponse({
      ok: true,
      boy: {
        id: data.id,
        name: data.name || '',
        username: data.username || cleanUsername,
        role: 'boy',
        avatarKey: data.avatar_key && data.avatar_key !== 'NULL' ? data.avatar_key : '',
      },
    })
  } catch (error) {
    console.error('Errore login-boy:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})