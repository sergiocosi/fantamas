import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';

export default function LandingScreen({ users, loginAs, resetDemo }) {
  const boys = users.filter(user => user.role === 'boy');
  const operators = users.filter(user => user.role === 'operator');

  return (
    <Shell title="Scegli l’accesso" subtitle="Web app demo con dati salvati in locale." onReset={resetDemo}>
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-orange-500 to-amber-400 text-white border-orange-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-orange-100">MasQueNada</div>
              <div className="text-3xl md:text-4xl font-black mt-1">Partecipa, aiuta, guadagna punti</div>
              <p className="mt-3 text-orange-50 max-w-2xl">
                Una prima versione semplice per ragazzi e operatori: richieste punti, verifiche, storico e classifica.
              </p>
            </div>
            <div className="rounded-[24px] bg-white/15 backdrop-blur px-5 py-4 min-w-[220px]">
              <div className="text-sm text-orange-100">Profili demo</div>
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
            Ogni ragazzo entra con il proprio profilo, invia attività e controlla punti e classifica.
          </p>
          <div className="grid gap-3">
            {boys.map(user => (
              <ActionButton key={user.id} onClick={() => loginAs(user.id)}>
                <div className="text-lg font-bold">Entra come {user.name}</div>
                <div className="text-sm text-neutral-600 mt-1">Profilo ragazzo</div>
              </ActionButton>
            ))}
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