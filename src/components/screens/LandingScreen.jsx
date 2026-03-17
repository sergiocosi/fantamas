import React, { useMemo, useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';

export default function LandingScreen({ users, loginAs }) {
  const [boySearch, setBoySearch] = useState('');

  const boys = useMemo(
    () => users.filter(user => user.role === 'boy'),
    [users]
  );

  const operators = useMemo(
    () => users.filter(user => user.role === 'operator'),
    [users]
  );

  const filteredBoys = useMemo(() => {
    const query = boySearch.trim().toLowerCase();

    if (!query) return boys;

    return boys.filter(user =>
      user.name.toLowerCase().includes(query)
    );
  }, [boys, boySearch]);

  return (
    <Shell title="Scegli l’accesso" subtitle="Accedi come ragazzo o operatore.">
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-orange-500 to-amber-400 text-white border-orange-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-orange-100">MasQueNada</div>
              <div className="text-3xl md:text-4xl font-black mt-1">Partecipa, aiuta, guadagna punti</div>
              <p className="mt-3 text-orange-50 max-w-2xl">
                Una versione semplice per ragazzi e operatori: richieste punti, verifiche, storico e classifica.
              </p>
            </div>
            <div className="rounded-[24px] bg-white/15 backdrop-blur px-5 py-4 min-w-[220px]">
              <div className="text-sm text-orange-100">Profili disponibili</div>
              <div className="text-3xl font-black mt-1">{boys.length + operators.length}</div>
              <div className="text-sm text-orange-50 mt-1">ragazzi + operatori</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <Card className="bg-orange-50 border-orange-200">
          <div className="text-5xl mb-4">🧑‍🤝‍🧑</div>
          <div className="text-2xl font-bold mb-2">Area Ragazzi</div>
          <p className="text-neutral-700 mb-5 text-base leading-6">
            Cerca il tuo nome e accedi al tuo profilo.
          </p>

          <div className="mb-4">
            <input
              type="text"
              value={boySearch}
              onChange={event => setBoySearch(event.target.value)}
              placeholder="Cerca il tuo nome..."
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm bg-white"
            />
          </div>

          <div className="grid gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredBoys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-orange-300 bg-white px-4 py-5 text-neutral-600">
                Nessun ragazzo trovato.
              </div>
            ) : (
              filteredBoys.map(user => (
                <ActionButton key={user.id} onClick={() => loginAs(user.id)}>
                  <div className="text-lg font-bold">Entra come {user.name}</div>
                  <div className="text-sm text-neutral-600 mt-1">Profilo ragazzo</div>
                </ActionButton>
              ))
            )}
          </div>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <div className="text-5xl mb-4">🧑‍🏫</div>
          <div className="text-2xl font-bold mb-2">Area Operatori</div>
          <p className="text-neutral-700 mb-5 text-base leading-6">
            Gli operatori verificano le richieste e possono aggiungere bonus o malus manualmente.
          </p>
          <div className="grid gap-3">
            {operators.map(user => (
              <ActionButton
                key={user.id}
                onClick={() => loginAs(user.id)}
                className="bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
              >
                <div className="text-lg font-bold">Entra come {user.name}</div>
                <div className="text-sm text-slate-300 mt-1">Profilo operatore</div>
              </ActionButton>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}