import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function BoyLoginScreen({
  currentUser,
  boyPasswordInput,
  setBoyPasswordInput,
  submitBoyPassword,
  onBack,
}) {
  return (
    <Shell
      title="Accesso Ragazzo"
      subtitle="Inserisci la tua password per continuare."
      onBack={onBack}
      currentUser={currentUser}
    >
      <div className="max-w-xl">
        <Card>
          <div className="text-lg font-bold mb-2">{currentUser?.name}</div>
          <div className="text-sm text-neutral-600 mb-3">Password personale</div>

          <input
            type="password"
            value={boyPasswordInput}
            onChange={event => setBoyPasswordInput(event.target.value)}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
            placeholder="Inserisci la password"
          />

          <div className="mt-4">
            <button
              onClick={submitBoyPassword}
              className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
            >
              Entra
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}