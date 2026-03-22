import { createClient } from 'npm:@supabase/supabase-js@2'

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const [boysResult, rulesResult, requestsResult] = await Promise.all([
      supabase
        .from('boys')
        .select('id, name, username, avatar_url, avatar_key, created_at')
        .order('created_at', { ascending: true }),

      supabase
        .from('rules')
        .select('id, category, label, points, kind, boy_selectable, icon, color, created_at')
        .order('created_at', { ascending: true }),

      supabase
        .from('requests')
        .select('id, user_id, user_name, rule_id, activity, points, final_points, status, created_at, note, decided_by')
        .order('created_at', { ascending: false }),
    ])

    if (boysResult.error || rulesResult.error || requestsResult.error) {
      console.error('Errore get-app-data:', {
        boysError: boysResult.error,
        rulesError: rulesResult.error,
        requestsError: requestsResult.error,
      })

      return jsonResponse({ error: 'Errore caricamento dati app' }, 500)
    }

    return jsonResponse({
      ok: true,
      boys: boysResult.data || [],
      rules: rulesResult.data || [],
      requests: requestsResult.data || [],
    })
  } catch (error) {
    console.error('Errore get-app-data catch:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})