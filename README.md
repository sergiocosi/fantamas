# FantaMas

Webapp per dare punti ai ragazzi per i compiti quotidiani, con classifica e premi a fine mese.

- **Frontend**: React + Vite, pubblicato su Vercel (ogni push su `main` si aggiorna da solo).
- **Backend**: Supabase. Una sola Edge Function, `api` (`supabase/functions/api/index.ts`), che gestisce tutte le azioni e controlla chi può fare cosa.

## Ruoli

- **Ragazzo**: invia richieste di punti, sceglie l'avatar, cambia la propria password.
- **Operatore**: approva/modifica/rifiuta le richieste, aggiunge bonus/malus, gestisce ragazzi e regole.
- **Visitatore**: vede classifica e regole.

## Classifica mensile

La classifica mostra solo i punti del mese in corso e riparte da zero il 1° di ogni mese, senza cancellare niente.
Con le frecce si vedono le classifiche dei mesi passati (utile per assegnare i premi).
I punti contano nel mese in cui il ragazzo ha inviato la richiesta.

## Aggiornare la funzione su Supabase

Dashboard Supabase → Edge Functions → `api` → Code → incolla il contenuto di `supabase/functions/api/index.ts` → Deploy.
Nelle impostazioni della funzione "Verify JWT" deve essere **disattivato** (il controllo lo fa il codice).

## Sviluppo locale

```bash
npm install
npm run dev
```

Serve un file `.env` con `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
