// FantaMas — funzione unica che sostituisce le 22 funzioni precedenti.
// Il frontend la chiama con { endpoint: 'nome-azione', token, ...dati }.
// I nomi delle azioni sono gli stessi delle vecchie funzioni.

import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const db = createClient(SUPABASE_URL, SERVICE_KEY)

const TOKEN_DAYS = 60
const FAMILY_LINK_DAYS = 365
const PHOTO_BUCKET = 'avatars'
const MAX_PHOTO_BYTES = 1_500_000
const PBKDF2_ITERATIONS = 100_000

// ---------- utilità ----------

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function fail(status: number, message: string): never {
  throw new ApiError(status, message)
}

function check<T>(result: { data: T; error: unknown }, label: string): T {
  if (result.error) {
    console.error(`Errore database (${label}):`, result.error)
    fail(500, (result.error as { message?: string }).message || 'Errore database')
  }
  return result.data
}

const str = (v: unknown) => String(v ?? '').trim()

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getRuleStyle(category: string, kind: string) {
  const styles: [string, string, string][] = [
    ['pulizia', 'sky', '🧹'],
    ['pranzo', 'orange', '🍽️'],
    ['rifiuti', 'emerald', '♻️'],
    ['cucina', 'amber', '🍳'],
    ['uscite', 'cyan', '🛒'],
    ['spesa', 'cyan', '🛒'],
    ['didattica', 'violet', '🎙️'],
    ['podcast', 'violet', '🎙️'],
    ['laboratori', 'violet', '🎙️'],
    ['cura', 'teal', '👕'],
    ['attenzione', 'rose', '⚠️'],
  ]
  const key = category.toLowerCase()
  const match = styles.find(([word]) => key.includes(word))
  if (match) return { color: match[1], icon: match[2] }
  return kind === 'malus' ? { color: 'rose', icon: '⚠️' } : { color: 'orange', icon: '⭐' }
}

const cleanAvatar = (v: string | null) => (v && v !== 'NULL' ? v : '')

// ---------- password (hash PBKDF2, con conversione automatica di quelle in chiaro) ----------

const enc = new TextEncoder()
const b64 = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)))
const unb64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0))

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256)
}

async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS)
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64(salt)}$${b64(hash)}`
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// Restituisce { ok, upgrade }: upgrade = true se la password era salvata in chiaro.
async function verifyPassword(input: string, saved: string | null) {
  const stored = str(saved)
  if (!stored) return { ok: false, upgrade: false }
  if (stored.startsWith('pbkdf2$')) {
    const [, iter, salt, hash] = stored.split('$')
    const test = await pbkdf2(input, unb64(salt), Number(iter))
    return { ok: safeEqual(b64(test), hash), upgrade: false }
  }
  return { ok: safeEqual(stored, input), upgrade: true }
}

// ---------- token di sessione firmato ----------

type Session = { role: 'boy' | 'operator' | 'visitor'; id: string; exp: number }

async function hmacKey() {
  return crypto.subtle.importKey('raw', enc.encode(SERVICE_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
}

async function sign(text: string) {
  return b64(await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(text)))
}

async function createToken(role: Session['role'], id: string, days = TOKEN_DAYS) {
  const payload = b64(enc.encode(JSON.stringify({ role, id, exp: Date.now() + days * 86_400_000 })))
  return `${payload}.${await sign(payload)}`
}

async function readToken(token: unknown): Promise<Session | null> {
  const [payload, signature] = str(token).split('.')
  if (!payload || !signature) return null
  if (!safeEqual(await sign(payload), signature)) return null
  try {
    const session = JSON.parse(new TextDecoder().decode(unb64(payload))) as Session
    return session.exp > Date.now() ? session : null
  } catch {
    return null
  }
}

async function requireBoy(token: unknown) {
  const s = await readToken(token)
  if (!s || s.role !== 'boy') fail(401, 'Sessione scaduta, rifai il login')
  const boy = check(await db.from('boys').select('id, name, password').eq('id', s.id).maybeSingle(), 'boys')
  if (!boy) fail(401, 'Sessione scaduta, rifai il login')
  return boy
}

async function requireOperator(token: unknown) {
  const s = await readToken(token)
  if (!s || s.role !== 'operator') fail(403, 'Solo gli operatori possono farlo')
  const op = check(
    await db.from('operators').select('id, name, password, active').eq('id', s.id).maybeSingle(),
    'operators'
  )
  if (!op || op.active !== true) fail(403, 'Operatore non attivo')
  return op
}

// Il ragazzo agisce su se stesso, l'operatore su qualunque ragazzo (boyId)
async function requireBoyOrOperator(token: unknown, boyId: unknown) {
  const s = await readToken(token)
  if (s?.role === 'boy') return await requireBoy(token)
  if (s?.role === 'operator') {
    await requireOperator(token)
    return await findBoy(boyId)
  }
  fail(403, 'Non autorizzato')
}

// ---------- foto ----------

function photoPathFromUrl(url: string | null) {
  const marker = `/${PHOTO_BUCKET}/`
  const i = str(url).indexOf(marker)
  return i >= 0 ? str(url).slice(i + marker.length) : ''
}

async function uploadToBucket(path: string, bytes: Uint8Array) {
  const upload = () => db.storage.from(PHOTO_BUCKET).upload(path, bytes, { contentType: 'image/jpeg', upsert: true })
  let { error } = await upload()
  if (error && /not found/i.test(error.message)) {
    // primo utilizzo: crea lo spazio per le foto
    const created = await db.storage.createBucket(PHOTO_BUCKET, { public: true, fileSizeLimit: MAX_PHOTO_BYTES })
    if (created.error && !/already exists/i.test(created.error.message)) {
      console.error('Errore creazione bucket:', created.error)
      fail(500, 'Errore preparazione spazio foto')
    }
    ;({ error } = await upload())
  }
  if (error) {
    console.error('Errore upload foto:', error)
    fail(500, 'Errore caricamento foto')
  }
  return db.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

async function removeFromBucket(url: string | null) {
  const path = photoPathFromUrl(url)
  if (path) await db.storage.from(PHOTO_BUCKET).remove([path])
}

// ---------- login ----------

async function login(table: 'boys' | 'operators' | 'visitors', role: Session['role'], body: Record<string, unknown>) {
  const username = role === 'operator' ? str(body.username) : str(body.username).toLowerCase()
  const password = str(body.password)
  if (!username || !password) fail(400, 'Username e password sono obbligatori')

  const fields = role === 'boy' ? 'id, name, username, password, avatar_key' : 'id, name, username, password, active'
  const row = check(await db.from(table).select(fields).eq('username', username).maybeSingle(), table) as Record<
    string,
    // deno-lint-ignore no-explicit-any
    any
  > | null

  const wrong = role === 'boy' ? 'Credenziali ragazzo non corrette' : 'Credenziali non corrette'
  if (!row) fail(401, wrong)
  if (role !== 'boy' && row.active !== true) fail(403, 'Utente non attivo')

  const { ok, upgrade } = await verifyPassword(password, row.password)
  if (!ok) fail(401, wrong)
  if (upgrade) await db.from(table).update({ password: await hashPassword(password) }).eq('id', row.id)

  const user = {
    id: row.id,
    name: row.name || (role === 'operator' ? 'Operatore' : role === 'visitor' ? 'Visitatore' : ''),
    username: row.username || username,
    role,
    ...(role === 'boy' ? { avatarKey: cleanAvatar(row.avatar_key) } : { active: true }),
  }
  const token = await createToken(role, row.id)
  // stessi nomi di campo che usava il frontend: boy / operator / visitor
  return { ok: true, token, [role]: user }
}

// ---------- azioni ----------

type Body = Record<string, unknown>
type Handler = (body: Body) => Promise<unknown>

async function newRequestRow(boy: { id: string; name: string }, fields: Record<string, unknown>) {
  const row = {
    id: `req-${Date.now()}`,
    user_id: boy.id,
    user_name: boy.name,
    created_at: new Date().toISOString(),
    note: '',
    decided_by: '',
    ...fields,
  }
  check(await db.from('requests').insert(row), 'insert requests')
  return { ok: true, request: row }
}

async function findBoy(id: unknown) {
  const boy = check(await db.from('boys').select('id, name').eq('id', str(id)).maybeSingle(), 'boys')
  if (!boy) fail(404, 'Ragazzo non trovato')
  return boy
}

async function findRule(id: unknown) {
  const rule = check(await db.from('rules').select('id, label, points').eq('id', str(id)).maybeSingle(), 'rules')
  if (!rule) fail(404, 'Regola non trovata')
  return rule
}

function ruleFields(body: Body) {
  const category = str(body.category)
  const label = str(body.label)
  const raw = Number(body.points)
  const kind = str(body.kind) === 'malus' ? 'malus' : 'bonus'
  if (!category || !label || Number.isNaN(raw)) fail(400, 'Dati regola non validi')
  return {
    category,
    label,
    points: kind === 'malus' ? -Math.abs(raw) : Math.abs(raw),
    kind,
    boy_selectable: Boolean(body.boySelectable),
    ...getRuleStyle(category, kind),
  }
}

const actions: Record<string, Handler> = {
  // --- pubbliche ---
  'get-app-data': async () => {
    const [boys, rules, requests] = await Promise.all([
      db.from('boys').select('id, name, username, avatar_url, avatar_key, created_at').order('created_at'),
      db.from('rules').select('id, category, label, points, kind, boy_selectable, icon, color, created_at').order('created_at'),
      db
        .from('requests')
        .select('id, user_id, user_name, rule_id, activity, points, final_points, status, created_at, note, decided_by')
        .order('created_at', { ascending: false }),
    ])
    return {
      ok: true,
      boys: check(boys, 'boys') || [],
      rules: check(rules, 'rules') || [],
      requests: check(requests, 'requests') || [],
    }
  },

  'login-boy': body => login('boys', 'boy', body),
  'login-operator': body => login('operators', 'operator', body),
  'login-visitor': body => login('visitors', 'visitor', body),

  'bootstrap-session': async body => {
    const s = await readToken(body.token)
    if (!s) fail(401, 'Sessione scaduta')
    const table = s.role === 'boy' ? 'boys' : s.role === 'operator' ? 'operators' : 'visitors'
    const fields = s.role === 'boy' ? 'id, name, username, avatar_url, avatar_key' : 'id, name, username, active'
    // deno-lint-ignore no-explicit-any
    const row = check(await db.from(table).select(fields).eq('id', s.id).maybeSingle(), table) as any
    if (!row || (s.role !== 'boy' && row.active !== true)) fail(401, 'Sessione scaduta')
    return {
      ok: true,
      user: {
        id: row.id,
        name: row.name,
        username: row.username || '',
        role: s.role,
        ...(s.role === 'boy' ? { avatar_url: row.avatar_url || '', avatar_key: cleanAvatar(row.avatar_key) } : {}),
      },
    }
  },

  // --- ragazzo (agisce sempre e solo su se stesso) ---
  'submit-request': async body => {
    const boy = await requireBoy(body.token)
    const rule = await findRule(body.ruleId)
    if (rule.points === null || rule.points === undefined || !rule.label) fail(400, 'Regola non valida')
    return newRequestRow(boy, { rule_id: rule.id, activity: rule.label, points: rule.points, status: 'pending' })
  },

  'save-boy-avatar': async body => {
    const boy = await requireBoy(body.token)
    const avatarKey = str(body.avatarKey)
    if (!avatarKey) fail(400, 'avatarKey obbligatorio')
    const data = check(
      await db.from('boys').update({ avatar_key: avatarKey }).eq('id', boy.id).select('id, avatar_key').maybeSingle(),
      'avatar'
    )
    return { ok: true, boy: data }
  },

  'change-boy-password': async body => {
    const boy = await requireBoy(body.token)
    const current = str(body.currentPassword)
    const next = str(body.newPassword)
    if (!current) fail(400, 'Password attuale obbligatoria')
    if (!next) fail(400, 'Nuova password obbligatoria')
    if (!(await verifyPassword(current, boy.password)).ok) fail(401, 'Password attuale non corretta')
    check(await db.from('boys').update({ password: await hashPassword(next) }).eq('id', boy.id), 'password')
    return { ok: true }
  },

  // --- foto: il ragazzo per sé, l'operatore per chiunque ---
  'upload-photo': async body => {
    const boy = await requireBoyOrOperator(body.token, body.boyId)
    const match = /^data:image\/jpeg;base64,(.+)$/.exec(str(body.image))
    if (!match) fail(400, 'Formato foto non valido')
    const bytes = unb64(match[1])
    if (bytes.length > MAX_PHOTO_BYTES) fail(400, 'Foto troppo grande')
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) fail(400, 'Formato foto non valido')

    const old = check(await db.from('boys').select('avatar_url').eq('id', boy.id).maybeSingle(), 'boys')
    const url = await uploadToBucket(`${boy.id}/${crypto.randomUUID()}.jpg`, bytes)
    check(await db.from('boys').update({ avatar_url: url }).eq('id', boy.id), 'save photo')
    await removeFromBucket(old?.avatar_url)
    return { ok: true, avatar_url: url }
  },

  'remove-photo': async body => {
    const boy = await requireBoyOrOperator(body.token, body.boyId)
    const old = check(await db.from('boys').select('avatar_url').eq('id', boy.id).maybeSingle(), 'boys')
    check(await db.from('boys').update({ avatar_url: '' }).eq('id', boy.id), 'remove photo')
    await removeFromBucket(old?.avatar_url)
    return { ok: true }
  },

  // --- operatore ---
  'list-operators': async body => {
    const me = await requireOperator(body.token)
    const operators = check(
      await db.from('operators').select('id, name, username, active').order('name'),
      'operators'
    )
    return { ok: true, meId: me.id, operators: (operators || []).filter(op => op.active === true) }
  },

  'add-operator': async body => {
    await requireOperator(body.token)
    const name = str(body.name)
    const username = str(body.username).toLowerCase()
    const password = str(body.password)
    if (!name || !username) fail(400, 'Nome e username sono obbligatori')
    if (!/^[a-z0-9._-]+$/.test(username)) fail(400, 'Lo username può contenere solo lettere minuscole, numeri, punto e trattino')
    if (password.length < 4) fail(400, 'La password deve contenere almeno 4 caratteri')

    const existing = check(
      await db.from('operators').select('id, active').eq('username', username).maybeSingle(),
      'operators'
    )
    const hashed = await hashPassword(password)
    if (existing?.active === true) fail(409, 'Esiste già un operatore con questo username')
    if (existing) {
      // era stato eliminato: lo riattivo con i nuovi dati
      check(await db.from('operators').update({ name, password: hashed, active: true }).eq('id', existing.id), 'operators')
      return { ok: true }
    }

    const row = { name, username, password: hashed, active: true }
    let result = await db.from('operators').insert(row)
    if (result.error && /null value.*"id"/i.test(result.error.message)) {
      result = await db.from('operators').insert({ id: crypto.randomUUID(), ...row })
    }
    check(result, 'add operator')
    return { ok: true }
  },

  'reset-operator-password': async body => {
    await requireOperator(body.token)
    const next = str(body.newPassword)
    if (next.length < 4) fail(400, 'La password deve contenere almeno 4 caratteri')
    const data = check(
      await db
        .from('operators')
        .update({ password: await hashPassword(next) })
        .eq('id', str(body.operatorId))
        .select('id')
        .maybeSingle(),
      'reset operator password'
    )
    if (!data) fail(404, 'Operatore non trovato')
    return { ok: true }
  },

  'delete-operator': async body => {
    const me = await requireOperator(body.token)
    const id = str(body.operatorId)
    if (id === me.id) fail(400, 'Non puoi eliminare te stesso')
    const active = check(await db.from('operators').select('id').eq('active', true), 'operators') || []
    if (!active.some(op => op.id === id)) fail(404, 'Operatore non trovato')
    if (active.length <= 1) fail(400, "Deve restare almeno un operatore")
    // disattivazione: non perde lo storico e le sue sessioni smettono subito di funzionare
    check(await db.from('operators').update({ active: false }).eq('id', id), 'delete operator')
    return { ok: true }
  },

  'create-family-link': async body => {
    await requireOperator(body.token)
    const visitor = check(
      await db.from('visitors').select('id').eq('active', true).order('id').limit(1).maybeSingle(),
      'visitors'
    )
    if (!visitor) fail(404, 'Nessun profilo visitatore attivo')
    return { ok: true, token: await createToken('visitor', visitor.id, FAMILY_LINK_DAYS) }
  },

  'change-operator-password': async body => {
    const op = await requireOperator(body.token)
    const current = str(body.currentPassword)
    const next = str(body.newPassword)
    if (!current || !next) fail(400, 'Compila tutti i campi')
    if (next.length < 4) fail(400, 'La nuova password deve contenere almeno 4 caratteri')
    if (next === current) fail(400, 'La nuova password deve essere diversa da quella attuale')
    if (!(await verifyPassword(current, op.password)).ok) fail(401, 'Password attuale non corretta')
    check(await db.from('operators').update({ password: await hashPassword(next) }).eq('id', op.id), 'password')
    return { ok: true }
  },

  'decide-request': async body => {
    const op = await requireOperator(body.token)
    const action = str(body.action)
    if (action !== 'approve' && action !== 'reject') fail(400, 'action non valida')
    const update =
      action === 'approve'
        ? { status: 'approved', decided_by: op.name, note: '' }
        : { status: 'rejected', decided_by: op.name, note: 'Non confermato' }
    const data = check(
      await db
        .from('requests')
        .update(update)
        .eq('id', str(body.requestId))
        .eq('status', 'pending')
        .select('id, status, decided_by, note')
        .maybeSingle(),
      'decide'
    )
    if (!data) fail(404, 'Richiesta non trovata o già decisa')
    return { ok: true, request: data }
  },

  'modify-request': async body => {
    const op = await requireOperator(body.token)
    const finalPoints = Number(body.finalPoints)
    if (!Number.isFinite(finalPoints)) fail(400, 'Punti non validi')
    const data = check(
      await db
        .from('requests')
        .update({ status: 'modified', final_points: finalPoints, note: str(body.note), decided_by: op.name })
        .eq('id', str(body.requestId))
        .eq('status', 'pending')
        .select('id, status, final_points, note, decided_by')
        .maybeSingle(),
      'modify'
    )
    if (!data) fail(404, 'Richiesta non trovata o già decisa')
    return { ok: true, request: data }
  },

  'delete-request': async body => {
    await requireOperator(body.token)
    const data = check(
      await db.from('requests').delete().eq('id', str(body.requestId)).select('id').maybeSingle(),
      'delete request'
    )
    if (!data) fail(404, 'Movimento non trovato')
    return { ok: true, deletedId: data.id }
  },

  'add-manual-entry': async body => {
    const op = await requireOperator(body.token)
    const boy = await findBoy(body.userId)
    const rule = await findRule(body.ruleId)
    return newRequestRow(boy, {
      rule_id: rule.id,
      activity: rule.label,
      points: rule.points,
      status: 'approved',
      note: str(body.note),
      decided_by: op.name,
    })
  },

  'add-manual-adjustment': async body => {
    const op = await requireOperator(body.token)
    const boy = await findBoy(body.userId)
    const points = Number(body.points)
    if (!Number.isFinite(points)) fail(400, 'Punti non validi')
    return newRequestRow(boy, {
      rule_id: 'manual-adjustment',
      activity: 'Bonus/Malus manuale',
      points,
      status: 'approved',
      note: str(body.reason),
      decided_by: op.name,
    })
  },

  'add-boy': async body => {
    await requireOperator(body.token)
    const name = str(body.name)
    if (!name) fail(400, 'Nome obbligatorio')
    const id = slugify(name) || `ragazzo-${Date.now()}`
    if (check(await db.from('boys').select('id').eq('id', id).maybeSingle(), 'boys'))
      fail(409, 'Esiste già un ragazzo con questo identificativo')
    if (check(await db.from('boys').select('id').ilike('name', name).maybeSingle(), 'boys'))
      fail(409, 'Esiste già un ragazzo con questo nome')
    const boy = check(
      await db
        .from('boys')
        .insert({ id, name, role: 'boy', username: id, password: await hashPassword('1234') })
        .select('id, name, username')
        .maybeSingle(),
      'add boy'
    )
    return { ok: true, boy }
  },

  'update-boy': async body => {
    await requireOperator(body.token)
    const id = str(body.boyId)
    const name = str(body.name)
    if (!id || !name) fail(400, 'Nome obbligatorio')
    if (check(await db.from('boys').select('id').neq('id', id).ilike('name', name).maybeSingle(), 'boys'))
      fail(409, 'Esiste già un ragazzo con questo nome')
    const boy = check(await db.from('boys').update({ name }).eq('id', id).select('id, name').maybeSingle(), 'update boy')
    if (!boy) fail(404, 'Ragazzo non trovato')
    check(await db.from('requests').update({ user_name: name }).eq('user_id', id), 'update requests')
    return { ok: true, boy }
  },

  'delete-boy': async body => {
    await requireOperator(body.token)
    const boy = await findBoy(body.boyId)
    check(await db.from('requests').delete().eq('user_id', boy.id), 'delete requests')
    check(await db.from('boys').delete().eq('id', boy.id), 'delete boy')
    return { ok: true, deletedId: boy.id }
  },

  'reset-boy-password': async body => {
    await requireOperator(body.token)
    const next = str(body.newPassword)
    if (!next) fail(400, 'Nuova password obbligatoria')
    const data = check(
      await db.from('boys').update({ password: await hashPassword(next) }).eq('id', str(body.boyId)).select('id').maybeSingle(),
      'reset password'
    )
    if (!data) fail(404, 'Ragazzo non trovato')
    return { ok: true }
  },

  'add-rule': async body => {
    await requireOperator(body.token)
    const fields = ruleFields(body)
    const id = slugify(`${fields.category}-${fields.label}`) || `regola-${Date.now()}`
    check(await db.from('rules').insert({ id, ...fields }), 'add rule')
    return { ok: true, ruleId: id }
  },

  'update-rule': async body => {
    await requireOperator(body.token)
    const rule = check(
      await db.from('rules').update(ruleFields(body)).eq('id', str(body.ruleId)).select('*').maybeSingle(),
      'update rule'
    )
    if (!rule) fail(404, 'Regola non trovata')
    return { ok: true, rule }
  },

  'delete-rule': async body => {
    await requireOperator(body.token)
    const data = check(await db.from('rules').delete().eq('id', str(body.ruleId)).select('id').maybeSingle(), 'delete rule')
    if (!data) fail(404, 'Regola non trovata')
    return { ok: true, deletedId: data.id }
  },
}

// ---------- ingresso ----------

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405)

  let body: Body
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'Richiesta non valida' }, 400)
  }

  const handler = actions[str(body.endpoint)]
  if (!handler) return json({ ok: false, error: 'Azione sconosciuta' }, 400)

  try {
    return json(await handler(body))
  } catch (error) {
    if (error instanceof ApiError) return json({ ok: false, error: error.message }, error.status)
    console.error(`Errore in ${body.endpoint}:`, error)
    return json({ ok: false, error: 'Errore interno' }, 500)
  }
})
