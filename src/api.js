import { supabase } from './supabase';

const SESSION_STORAGE_KEY = 'fantamas_session';

export function saveSession(sessionData) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Errore salvataggio sessione:', error);
  }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Errore lettura sessione:', error);
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // niente da fare
  }
}

// Chiama la funzione unica "api" su Supabase.
// Restituisce { data, error } come supabase.functions.invoke, così il resto del codice non cambia.
// Gli errori "previsti" (password sbagliata, permessi...) arrivano in data.error.
export async function callApi(endpoint, payload = {}) {
  const token = loadSession()?.token || '';

  const { data, error } = await supabase.functions.invoke('api', {
    body: { ...payload, endpoint, token },
  });

  if (error && error.context && typeof error.context.json === 'function') {
    try {
      const body = await error.context.json();
      if (body && typeof body === 'object') return { data: body, error: null, status: error.context.status };
    } catch {
      // risposta non leggibile: restituisco l'errore originale
    }
  }

  return { data, error, status: error ? 0 : 200 };
}
