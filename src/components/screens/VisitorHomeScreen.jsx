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
      currentUser={currentUser}
    >
      <div className="flex items-center justify-end mb-4">

        <button
          onClick={onLogout}
          className="rounded-2xl px-3 py-2 bg-white border border-neutral-200 text-neutral-600 hover:text-rose-600 hover:border-rose-200 text-sm font-semibold shadow-sm"
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
          className="border-orange-200 bg-orange-50 hover:bg-orange-100 text-neutral-900"
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