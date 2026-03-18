import Shell from '../ui/Shell';
import ActionButton from '../ui/ActionButton';

export default function VisitorHomeScreen({
  currentUser,
  onLogout,
  goToLeaderboard,
  goToRules,
  goToHowItWorks,
}) {
  return (
    <Shell
      title="Area Visitatore"
      subtitle="Accesso in sola lettura."
      onBack={onLogout}
      currentUser={currentUser}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-600">
          Profilo: <span className="font-semibold">{currentUser?.name || '—'}</span>
        </div>

        <button
          onClick={onLogout}
          className="rounded-2xl px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold shadow-sm"
        >
          Esci
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ActionButton
          onClick={goToLeaderboard}
          className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-neutral-900"
        >
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold">Classifica</div>
          <div className="text-sm text-neutral-600">Guarda i punteggi del gruppo</div>
        </ActionButton>

        <ActionButton
          onClick={goToRules}
          className="border-sky-200 bg-sky-50 hover:bg-sky-100 text-neutral-900"
        >
          <div className="text-3xl mb-2">📚</div>
          <div className="font-bold">Attività disponibili</div>
          <div className="text-sm text-neutral-600">Vedi bonus, malus e categorie</div>
        </ActionButton>

        <ActionButton
          onClick={goToHowItWorks}
          className="border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-neutral-900"
        >
          <div className="text-3xl mb-2">ℹ️</div>
          <div className="font-bold">Come funziona</div>
          <div className="text-sm text-neutral-600">Spiegazione del progetto</div>
        </ActionButton>
      </div>
    </Shell>
  );
}