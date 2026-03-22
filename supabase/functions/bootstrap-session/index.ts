import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const body = await req.json().catch(() => null)
    const role = String(body?.role || '').trim().toLowerCase()
    const userId = String(body?.userId || '').trim()

    if (!role || !userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'role e userId sono obbligatori' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!['boy', 'operator', 'visitor'].includes(role)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Ruolo non valido' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (role === 'boy') {
      const { data, error } = await supabaseAdmin
        .from('boys')
        .select('id, name, username, avatar_url, avatar_key')
        .eq('id', userId)
        .maybeSingle()

      if (error || !data) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Ragazzo non trovato' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      return new Response(
        JSON.stringify({
          ok: true,
          user: {
            id: data.id,
            name: data.name,
            username: data.username || '',
            avatar_url: data.avatar_url || '',
            avatar_key:
              data.avatar_key && data.avatar_key !== 'NULL' ? data.avatar_key : '',
            role: 'boy',
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (role === 'operator') {
      const { data, error } = await supabaseAdmin
        .from('operators')
        .select('id, name, username, active')
        .eq('id', userId)
        .eq('active', true)
        .maybeSingle()

      if (error || !data) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Operatore non trovato o non attivo' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      return new Response(
        JSON.stringify({
          ok: true,
          user: {
            id: data.id,
            name: data.name,
            username: data.username || '',
            role: 'operator',
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (role === 'visitor') {
      const { data, error } = await supabaseAdmin
        .from('visitors')
        .select('id, name, username, active')
        .eq('id', userId)
        .eq('active', true)
        .maybeSingle()

      if (error || !data) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Visitatore non trovato o non attivo' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      return new Response(
        JSON.stringify({
          ok: true,
          user: {
            id: data.id,
            name: data.name,
            username: data.username || '',
            role: 'visitor',
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Ruolo non gestito' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('bootstrap-session error:', error)

    return new Response(
      JSON.stringify({ ok: false, error: 'Errore interno' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})