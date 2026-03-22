import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function BoyLoginScreen({
  currentUser,
  boyUsernameInput,
  setBoyUsernameInput,
  boyPasswordInput,
  setBoyPasswordInput,
  submitBoyPassword,
  onBack,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    submitBoyPassword();
  }

  return (
    <Shell
      title="Accesso Ragazzo"
      subtitle="Inserisci username e password per continuare."
      onBack={onBack}
      currentUser={currentUser}
    >
      <div className="max-w-xl">
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="text-sm text-neutral-600 mb-3">
              Accesso personale
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={boyUsernameInput}
                onChange={event => setBoyUsernameInput(event.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Inserisci username"
                autoComplete="username"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={boyPasswordInput}
                onChange={event => setBoyPasswordInput(event.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Inserisci la password"
                autoComplete="current-password"
              />
            </div>

            <div>
              <button
                type="submit"
                className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
              >
                Entra
              </button>
            </div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}