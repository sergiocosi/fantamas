import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';

export default function BoyConfirmScreen({
  currentUser,
  selectedRule,
  goBack,
  onSubmitRequest,
}) {
  return (
    <Shell
      title="Conferma richiesta"
      subtitle="Controlla e invia."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-2xl">
        <Card>
          <div className="text-sm text-neutral-500">Attività selezionata</div>
          <div className="text-2xl font-semibold mt-1">{selectedRule.label}</div>
          <div className="mt-4 inline-flex rounded-full bg-emerald-100 text-emerald-800 px-4 py-2 font-semibold border border-emerald-200">
            Punti previsti: {selectedRule.points > 0 ? '+' : ''}{selectedRule.points}
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <ActionButton
              onClick={onSubmitRequest}
              className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            >
              Invia richiesta
            </ActionButton>
            <ActionButton onClick={goBack}>
              Annulla
            </ActionButton>
          </div>
        </Card>
      </div>
    </Shell>
  );
}