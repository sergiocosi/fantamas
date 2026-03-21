import Shell from '../ui/Shell';
import ActionButton from '../ui/ActionButton';

export default function OperatorHomeScreen({
  currentUser,
  pendingRequests,
  onLogout,
  goToRequests,
  goToManual,
  goToHistory,
  goToLeaderboard,
  setScreen,
}) {
  return (
    <Shell
      title="Area Operatori"
      subtitle="Controllo rapido delle attività."
      onBack={onLogout}
      currentUser={currentUser}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-600">
          Operatore: <span className="font-semibold">{currentUser?.name || '—'}</span>
        </div>

        <button
          onClick={onLogout}
          className="rounded-2xl px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold shadow-sm"
        >
          Esci
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        <ActionButton onClick={goToRequests}>
          <div className="text-3xl mb-2">✅</div>
          <div className="font-semibold">Verifica richieste</div>
          <div className="text-sm text-neutral-600">Approva, modifica o rifiuta</div>
        </ActionButton>

        <ActionButton onClick={goToManual}>
          <div className="text-3xl mb-2">✍️</div>
          <div className="font-semibold">Aggiungi bonus / malus</div>
          <div className="text-sm text-neutral-600">Inserimento manuale</div>
        </ActionButton>

        <ActionButton onClick={goToHistory}>
          <div className="text-3xl mb-2">🕘</div>
          <div className="font-semibold">Storico</div>
          <div className="text-sm text-neutral-600">Tutti i movimenti</div>
        </ActionButton>

        <ActionButton onClick={goToLeaderboard}>
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-semibold">Classifica ragazzi</div>
          <div className="text-sm text-neutral-600">Visualizza punteggi e posizioni</div>
        </ActionButton>

        <ActionButton onClick={() => setScreen('operator-change-password')}>
          <div className="text-3xl mb-2">🔐</div>
          <div className="font-semibold">Cambio Password</div>
          <div className="text-sm text-neutral-600">Clicca per cambiare password</div>
        </ActionButton>
      </div>
    </Shell>
  );
}