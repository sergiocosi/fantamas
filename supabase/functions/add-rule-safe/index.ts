import { createClient } from 'npm:@supabase/supabase-js@2'

type Payload = {
  category?: string
  label?: string
  points?: number | string
  kind?: 'bonus' | 'malus'
  boySelectable?: boolean
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getRuleStyle(category: string, kind: string) {
  const colorByCategory: Record<string, string> = {
    pulizia: 'sky',
    pranzo: 'orange',
    rifiuti: 'emerald',
    cucina: 'amber',
    uscite: 'cyan',
    spesa: 'cyan',
    didattica: 'violet',
    podcast: 'violet',
    laboratori: 'violet',
    cura: 'teal',
    attenzione: 'rose',
  }

  const iconByCategory: Record<string, string> = {
    pulizia: '🧹',
    pranzo: '🍽️',
    rifiuti: '♻️',
    cucina: '🍳',
    uscite: '🛒',
    spesa: '🛒',
    didattica: '🎙️',
    podcast: '🎙️',
    laboratori: '🎙️',
    cura: '👕',
    attenzione: '⚠️',
  }

  const categoryKey = category.toLowerCase()
  const matchedColor = Object.keys(colorByCategory).find(key => categoryKey.includes(key))
  const matchedIcon = Object.keys(iconByCategory).find(key => categoryKey.includes(key))

  return {
    icon: matchedIcon ? iconByCategory[matchedIcon] : (kind === 'malus' ? '⚠️' : '⭐'),
    color: matchedColor ? colorByCategory[matchedColor] : (kind === 'malus' ? 'rose' : 'orange'),
  }
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
    const { category, label, points, kind, boySelectable }: Payload = await req.json()

    const cleanCategory = String(category || '').trim()
    const cleanLabel = String(label || '').trim()
    const rawPoints = Number(points)
    const cleanKind = String(kind || '').trim() === 'malus' ? 'malus' : 'bonus'
    const cleanBoySelectable = Boolean(boySelectable)

    if (!cleanCategory || !cleanLabel || Number.isNaN(rawPoints)) {
      return jsonResponse({ error: 'Dati regola non validi' }, 400)
    }

    const finalPoints = cleanKind === 'malus' ? -Math.abs(rawPoints) : Math.abs(rawPoints)
    const finalId = slugify(`${cleanCategory}-${cleanLabel}`) || `regola-${Date.now()}`
    const style = getRuleStyle(cleanCategory, cleanKind)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { error } = await supabase
      .from('rules')
      .insert({
        id: finalId,
        category: cleanCategory,
        label: cleanLabel,
        points: finalPoints,
        kind: cleanKind,
        boy_selectable: cleanBoySelectable,
        icon: style.icon,
        color: style.color,
      })

    if (error) {
      console.error('Errore add-rule-safe insert:', error)
      return jsonResponse({ error: error.message || 'Errore aggiunta regola' }, 500)
    }

    return jsonResponse({ ok: true, ruleId: finalId })
  } catch (error) {
    console.error('Errore add-rule-safe catch:', error)
    return jsonResponse({ error: 'Richiesta non valida' }, 400)
  }
})