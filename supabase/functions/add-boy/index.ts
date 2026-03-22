import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  name?: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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
    const { name }: Payload = await req.json()

    const cleanName = String(name || '').trim()

    if (!cleanName) {
      return jsonResponse({ error: 'Nome obbligatorio' }, 400)
    }

    const normalizedId = slugify(cleanName)
    const finalId = normalizedId || `ragazzo-${Date.now()}`
    const finalUsername = finalId

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: duplicateById, error: duplicateIdError } = await supabase
      .from('boys')
      .select('id')
      .eq('id', finalId)
      .maybeSingle()

    if (duplicateIdError) {
      console.error('Errore controllo id duplicato:', duplicateIdError)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (duplicateById) {
      return jsonResponse({ error: 'Esiste già un ragazzo con questo identificativo' }, 409)
    }

    const { data: duplicateByName, error: duplicateNameError } = await supabase
      .from('boys')
      .select('id')
      .ilike('name', cleanName)
      .maybeSingle()

    if (duplicateNameError) {
      console.error('Errore controllo nome duplicato:', duplicateNameError)
      return jsonResponse({ error: 'Errore database' }, 500)
    }

    if (duplicateByName) {
      return jsonResponse({ error: 'Esiste già un ragazzo con questo nome' }, 409)
    }

    const { data: insertedBoy, error: insertError } = await supabase
      .from('boys')
      .insert({
        id: finalId,
        name: cleanName,
        role: 'boy',
        username: finalUsername,
        password: '1234',
      })
      .select('id, name, username')
      .maybeSingle()

    if (insertError) {
      console.error('Errore aggiunta ragazzo:', insertError)
      return jsonResponse({ error: insertError.message || 'Errore aggiunta ragazzo' }, 500)
    }

    return jsonResponse({
      ok: true,
      boy: insertedBoy,
    })
  } catch (error) {
    console.error('Errore add-boy:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})