import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  boyId?: string
  avatarKey?: string
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
    const { boyId, avatarKey }: Payload = await req.json()

    const cleanBoyId = String(boyId || '').trim()
    const cleanAvatarKey = String(avatarKey || '').trim()

    if (!cleanBoyId) {
      return jsonResponse({ error: 'boyId obbligatorio' }, 400)
    }

    if (!cleanAvatarKey) {
      return jsonResponse({ error: 'avatarKey obbligatorio' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data, error } = await supabase
      .from('boys')
      .update({ avatar_key: cleanAvatarKey })
      .eq('id', cleanBoyId)
      .select('id, avatar_key')
      .maybeSingle()

    if (error) {
      console.error('Errore save-boy-avatar:', error)
      return jsonResponse({ error: error.message || 'Errore salvataggio avatar' }, 500)
    }

    if (!data) {
      return jsonResponse({ error: 'Ragazzo non trovato' }, 404)
    }

    return jsonResponse({
      ok: true,
      boy: data,
    })
  } catch (error) {
    console.error('Errore save-boy-avatar catch:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})