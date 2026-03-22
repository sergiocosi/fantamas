import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  userId?: string
  ruleId?: string
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
    const { userId, ruleId }: Payload = await req.json()

    const cleanUserId = String(userId || '').trim()
    const cleanRuleId = String(ruleId || '').trim()

    if (!cleanUserId) {
      return jsonResponse({ error: 'userId obbligatorio' }, 400)
    }

    if (!cleanRuleId) {
      return jsonResponse({ error: 'ruleId obbligatorio' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: boy, error: boyError } = await supabase
      .from('boys')
      .select('id, name')
      .eq('id', cleanUserId)
      .maybeSingle()

    if (boyError) {
      console.error('Errore query boy:', boyError)
      return jsonResponse({ error: 'Errore database su boys' }, 500)
    }

    if (!boy) {
      return jsonResponse({ error: 'Ragazzo non trovato' }, 404)
    }

    const { data: rule, error: ruleError } = await supabase
      .from('rules')
      .select('id, label, points')
      .eq('id', cleanRuleId)
      .maybeSingle()

    if (ruleError) {
      console.error('Errore query rule:', ruleError)
      return jsonResponse({ error: 'Errore database su rules' }, 500)
    }

    if (!rule) {
      return jsonResponse({ error: 'Regola non trovata' }, 404)
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      user_id: boy.id,
      user_name: boy.name,
      rule_id: rule.id,
      activity: rule.label,
      points: rule.points,
      status: 'pending',
      created_at: new Date().toISOString(),
      note: '',
      decided_by: '',
    }

    const { error: insertError } = await supabase
      .from('requests')
      .insert(newRequest)

    if (insertError) {
      console.error('Errore insert request:', insertError)
      return jsonResponse({ error: insertError.message || 'Errore inserimento richiesta' }, 500)
    }

    return jsonResponse({
      ok: true,
      request: newRequest,
    })
  } catch (error) {
    console.error('Errore submit-request:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})