import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function BoyChangePasswordScreen({
  currentUser,
  currentBoyPasswordInput,
  setCurrentBoyPasswordInput,
  newBoyPasswordInput,
  setNewBoyPasswordInput,
  confirmBoyPasswordInput,
  setConfirmBoyPasswordInput,
  changeBoyPassword,
  goBack,
}) {
  return (
    <Shell
      title="Cambia password"
      subtitle="Aggiorna la tua password personale."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-2xl">
        <Card>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-semibold text-neutral-700">Password attuale</label>
              <input
                type="password"
                value={currentBoyPasswordInput}
                onChange={event => setCurrentBoyPasswordInput(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Inserisci la password attuale"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700">Nuova password</label>
              <input
                type="password"
                value={newBoyPasswordInput}
                onChange={event => setNewBoyPasswordInput(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Inserisci la nuova password"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700">Conferma nuova password</label>
              <input
                type="password"
                value={confirmBoyPasswordInput}
                onChange={event => setConfirmBoyPasswordInput(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Ripeti la nuova password"
              />
            </div>

            <div>
              <button
                onClick={changeBoyPassword}
                className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
              >
                Salva nuova password
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}