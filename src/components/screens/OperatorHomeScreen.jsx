import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';

export default function OperatorHomeScreen({
  currentUser,
  pendingRequests,
  onLogout,
  goToRequests,
  goToManual,
  goToHistory,
}) {
  return (
    <Shell
      title="Area Operatori"
      subtitle="Controllo rapido delle attività."
      onBack={onLogout}
      currentUser={currentUser}
    >
      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 text-white lg:col-span-1">
          <div className="text-sm text-slate-300 uppercase tracking-wider">Richieste in attesa</div>
          <div className="text-6xl font-black mt-2">{pendingRequests.length}</div>
          <div className="text-sm text-slate-300 mt-2">Da controllare adesso</div>
        </Card>

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
      </div>
    </Shell>
  );
}