import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function OperatorLoginScreen({
  currentUser,
  operatorUsernameInput,
  setOperatorUsernameInput,
  operatorPasswordInput,
  setOperatorPasswordInput,
  submitOperatorPassword,
  onBack,
}) {
  return (
    <Shell
      title="Accesso Operatore"
      subtitle="Inserisci username e password per continuare."
      onBack={onBack}
      currentUser={currentUser}
    >
      <div className="max-w-xl">
        <Card>
          <div className="text-lg font-bold mb-3">Login operatore</div>

          <input
            type="text"
            value={operatorUsernameInput}
            onChange={event => setOperatorUsernameInput(event.target.value)}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm mb-3"
            placeholder="Inserisci lo username"
          />

          <input
            type="password"
            value={operatorPasswordInput}
            onChange={event => setOperatorPasswordInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') submitOperatorPassword();
            }}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
            placeholder="Inserisci la password"
          />

          <div className="mt-4">
            <button
              onClick={submitOperatorPassword}
              className="rounded-2xl px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm"
            >
              Entra
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}