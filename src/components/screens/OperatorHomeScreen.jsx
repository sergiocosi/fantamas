import Shell from '../ui/Shell';
import ActionButton from '../ui/ActionButton';

export default function OperatorHomeScreen({
  currentUser,
  pendingRequests,
  onLogout,
  goToRequests,
  goToManual,
  goToManage,
  goToHistory,
  goToLeaderboard,
  setScreen,
}) {
  return (
    <Shell
      title="Area Operatori"
      subtitle="Controllo rapido delle attività."
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        <ActionButton
          onClick={goToRequests}
          className={pendingRequests.length > 0 ? 'bg-orange-50 border-orange-300' : ''}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-3xl mb-2">✅</div>
            {pendingRequests.length > 0 && (
              <div className="min-w-8 h-8 px-2 rounded-full bg-orange-500 text-white font-black flex items-center justify-center">
                {pendingRequests.length}
              </div>
            )}
          </div>
          <div className="font-semibold">Verifica richieste</div>
          <div className="text-sm text-neutral-600">
            {pendingRequests.length === 0
              ? 'Nessuna richiesta in attesa'
              : pendingRequests.length === 1
                ? '1 richiesta da verificare'
                : `${pendingRequests.length} richieste da verificare`}
          </div>
        </ActionButton>

        <ActionButton onClick={goToManual}>
          <div className="text-3xl mb-2">✍️</div>
          <div className="font-semibold">Punti extra</div>
          <div className="text-sm text-neutral-600">Bonus e malus manuali</div>
        </ActionButton>
        <ActionButton onClick={goToManage}>
          <div className="text-3xl mb-2">⚙️</div>
          <div className="font-semibold">Gestione</div>
          <div className="text-sm text-neutral-600">Ragazzi, regole e password</div>
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