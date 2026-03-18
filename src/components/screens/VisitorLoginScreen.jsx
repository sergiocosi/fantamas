import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function VisitorLoginScreen({
  currentUser,
  visitorUsernameInput,
  setVisitorUsernameInput,
  visitorPasswordInput,
  setVisitorPasswordInput,
  submitVisitorLogin,
  onBack,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    submitVisitorLogin();
  }

  return (
    <Shell
      title="Accesso Visitatore"
      subtitle="Inserisci username e password per continuare."
      onBack={onBack}
      currentUser={currentUser}
    >
      <div className="max-w-xl">
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="text-lg font-bold mb-3">Login visitatore</div>

            <input
              type="text"
              value={visitorUsernameInput}
              onChange={event => setVisitorUsernameInput(event.target.value)}
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm mb-3"
              placeholder="Inserisci lo username"
            />

            <input
              type="password"
              value={visitorPasswordInput}
              onChange={event => setVisitorPasswordInput(event.target.value)}
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
              placeholder="Inserisci la password"
            />

            <div className="mt-4">
              <button
                type="submit"
                className="rounded-2xl px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-sm"
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