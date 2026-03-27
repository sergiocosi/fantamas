import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';

export default function LandingScreen({ users, goToBoyLogin, goToOperatorLogin, goToVisitorLogin }) {
  const boysCount = users.filter(user => user.role === 'boy').length;

  return (
    <Shell title="Scegli l’accesso" subtitle="Accedi come ragazzo, operatore o visitatore.">
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-orange-500 to-amber-400 text-white border-orange-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-orange-100">MasQueNada</div>
              <div className="text-3xl md:text-4xl font-black mt-1">Partecipa, aiuta, guadagna punti</div>
              <p className="mt-3 text-orange-50 max-w-2xl">
                Una versione semplice per ragazzi, operatori e visitatori: richieste punti, verifiche, storico e classifica.
              </p>
            </div>
            <div className="rounded-[24px] bg-white/15 backdrop-blur px-5 py-4 min-w-[220px]">
              <div className="text-sm text-orange-100">Profili disponibili</div>
              <div className="text-3xl font-black mt-1">{boysCount}</div>
              <div className="text-sm text-orange-50 mt-1">ragazzi registrati</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <Card className="bg-orange-50 border-orange-200">
          <div className="text-5xl mb-4">🧑‍🤝‍🧑</div>
          <div className="text-2xl font-bold mb-2">Area Ragazzi</div>
          <p className="text-neutral-700 mb-5 text-base leading-6">
            Accedi con username e password al tuo profilo personale.
          </p>

          <div className="grid gap-3">
            <ActionButton
              onClick={goToBoyLogin}
              className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            >
              <div className="text-lg font-bold">Accedi come ragazzo</div>
              <div className="text-sm text-orange-100 mt-1">Username e password</div>
            </ActionButton>
          </div>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <div className="text-5xl mb-4">🧑‍🏫</div>
          <div className="text-2xl font-bold mb-2" translate="no">Area Operatori</div>
          <p className="text-neutral-700 mb-5 text-base leading-6">
            Gli operatori verificano le richieste e possono aggiungere bonus o malus manualmente.
          </p>

          <div className="grid gap-3">
            <ActionButton
              onClick={goToOperatorLogin}
              className="bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
            >
              <div className="text-lg font-bold">Accedi come operatore</div>
              <div className="text-sm text-slate-300 mt-1">Username e password</div>
            </ActionButton>
          </div>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <div className="text-5xl mb-4">👀</div>
          <div className="text-2xl font-bold mb-2">Area Visitatore</div>
          <p className="text-neutral-700 mb-5 text-base leading-6">
            Accesso in sola lettura per vedere classifica, attività e funzionamento del progetto.
          </p>

          <div className="grid gap-3">
            <ActionButton
              onClick={goToVisitorLogin}
              className="bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-600"
            >
              <div className="text-lg font-bold">Accedi come visitatore</div>
              <div className="text-sm text-emerald-100 mt-1">Username e password</div>
            </ActionButton>
          </div>
        </Card>
      </div>
    </Shell>
  );
}