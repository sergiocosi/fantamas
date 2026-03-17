import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function OperatorManualScreen({
  currentUser,
  appState,
  operatorTargetUserId,
  setOperatorTargetUserId,
  operatorRuleId,
  setOperatorRuleId,
  operatorNote,
  setOperatorNote,
  newBoyName,
  setNewBoyName,
  newRuleCategory,
  setNewRuleCategory,
  newRuleLabel,
  setNewRuleLabel,
  newRulePoints,
  setNewRulePoints,
  newRuleKind,
  setNewRuleKind,
  newRuleSelectable,
  setNewRuleSelectable,
  deleteBoyId,
  setDeleteBoyId,
  deleteRuleId,
  setDeleteRuleId,
  editRuleId,
  setEditRuleId,
  editRuleCategory,
  setEditRuleCategory,
  editRuleLabel,
  setEditRuleLabel,
  editRulePoints,
  setEditRulePoints,
  editRuleKind,
  setEditRuleKind,
  editRuleSelectable,
  setEditRuleSelectable,
  editBoyId,
  setEditBoyId,
  editBoyName,
  setEditBoyName,
  addNewBoy,
  deleteBoy,
  updateBoy,
  passwordBoyId,
  setPasswordBoyId,
  newBoyPassword,
  setNewBoyPassword,
  updateBoyPassword,
  addNewRule,
  deleteRule,
  updateRule,
  addManualOperatorEntry,
  goBack,
}) {
  const operatorRules = appState.rules.filter(rule => !rule.boySelectable || rule.kind === 'bonus');
  const boys = appState.users.filter(user => user.role === 'boy');

  return (
    <Shell
      title="Aggiunta manuale punti"
      subtitle="Per bonus e malus decisi dagli operatori."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-3xl">
        <Card>
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Aggiungi un ragazzo</div>
            <div className="grid md:grid-cols-[1fr_auto] gap-3">
              <input
                value={newBoyName}
                onChange={event => setNewBoyName(event.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Scrivi il nome del ragazzo"
              />
              <button
                onClick={addNewBoy}
                className="rounded-2xl px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
              >
                Aggiungi ragazzo
              </button>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Elimina un ragazzo</div>
            <div className="grid md:grid-cols-[1fr_auto] gap-3">
              <select
                value={deleteBoyId}
                onChange={event => setDeleteBoyId(event.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
              >
                <option value="">Seleziona un ragazzo</option>
                {boys.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <button
                onClick={deleteBoy}
                className="rounded-2xl px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
              >
                Elimina ragazzo
              </button>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Modifica un ragazzo</div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Ragazzo da modificare</label>
                <select
                  value={editBoyId}
                  onChange={event => setEditBoyId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {boys.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">Nuovo nome</label>
                <input
                  value={editBoyName}
                  onChange={event => setEditBoyName(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                />
              </div>

              <div>
                <button
                  onClick={updateBoy}
                  className="rounded-2xl px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm"
                >
                  Salva modifica ragazzo
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Cambia password ragazzo</div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Ragazzo</label>
                <select
                  value={passwordBoyId}
                  onChange={event => setPasswordBoyId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {boys.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">Nuova password</label>
                <input
                  type="text"
                  value={newBoyPassword}
                  onChange={event => setNewBoyPassword(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  placeholder="Inserisci la nuova password"
                />
              </div>

              <div>
                <button
                  onClick={updateBoyPassword}
                  className="rounded-2xl px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm"
                >
                  Salva nuova password
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Aggiungi una regola</div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Categoria</label>
                <input
                  value={newRuleCategory}
                  onChange={event => setNewRuleCategory(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  placeholder="Es. Pulizia, Pranzo, Laboratori..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">Etichetta</label>
                <input
                  value={newRuleLabel}
                  onChange={event => setNewRuleLabel(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  placeholder="Es. Ho sistemato gli scaffali"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">Punti</label>
                <input
                  value={newRulePoints}
                  onChange={event => setNewRulePoints(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  placeholder="Es. 3 oppure -5"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">Tipo</label>
                <select
                  value={newRuleKind}
                  onChange={event => setNewRuleKind(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  <option value="bonus">Bonus</option>
                  <option value="malus">Malus</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                id="boySelectable"
                type="checkbox"
                checked={newRuleSelectable}
                onChange={event => setNewRuleSelectable(event.target.checked)}
              />
              <label htmlFor="boySelectable" className="text-sm font-semibold text-neutral-700">
                Selezionabile dai ragazzi
              </label>
            </div>

            <div className="mt-4">
              <button
                onClick={addNewRule}
                className="rounded-2xl px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-sm"
              >
                Aggiungi regola
              </button>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Elimina una regola</div>
            <div className="grid md:grid-cols-[1fr_auto] gap-3">
              <select
                value={deleteRuleId}
                onChange={event => setDeleteRuleId(event.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
              >
                <option value="">Seleziona una regola</option>
                {appState.rules.map(rule => (
                  <option key={rule.id} value={rule.id}>
                    {rule.category} — {rule.label}
                  </option>
                ))}
              </select>

              <button
                onClick={deleteRule}
                className="rounded-2xl px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
              >
                Elimina regola
              </button>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Modifica una regola</div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Regola da modificare</label>
                <select
                  value={editRuleId}
                  onChange={event => setEditRuleId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {appState.rules.map(rule => (
                    <option key={rule.id} value={rule.id}>
                      {rule.category} — {rule.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700">Categoria</label>
                  <input
                    value={editRuleCategory}
                    onChange={event => setEditRuleCategory(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Etichetta</label>
                  <input
                    value={editRuleLabel}
                    onChange={event => setEditRuleLabel(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Punti</label>
                  <input
                    value={editRulePoints}
                    onChange={event => setEditRulePoints(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Tipo</label>
                  <select
                    value={editRuleKind}
                    onChange={event => setEditRuleKind(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                  >
                    <option value="bonus">Bonus</option>
                    <option value="malus">Malus</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="editRuleSelectable"
                  type="checkbox"
                  checked={editRuleSelectable}
                  onChange={event => setEditRuleSelectable(event.target.checked)}
                />
                <label htmlFor="editRuleSelectable" className="text-sm font-semibold text-neutral-700">
                  Selezionabile dai ragazzi
                </label>
              </div>

              <div>
                <button
                  onClick={updateRule}
                  className="rounded-2xl px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm"
                >
                  Salva modifica regola
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-neutral-700">Ragazzo</label>
              <select
                value={operatorTargetUserId}
                onChange={event => setOperatorTargetUserId(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
              >
                {boys.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700">Voce</label>
              <select
                value={operatorRuleId}
                onChange={event => setOperatorRuleId(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
              >
                {operatorRules.map(rule => (
                  <option key={rule.id} value={rule.id}>
                    {rule.category} — {rule.label} ({rule.points > 0 ? '+' : ''}{rule.points})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-neutral-700">Nota facoltativa</label>
            <input
              value={operatorNote}
              onChange={event => setOperatorNote(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
              placeholder="Es. controllo entrata, comportamento, partecipazione parziale..."
            />
          </div>

          <div className="mt-6">
            <button
              onClick={addManualOperatorEntry}
              className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
            >
              Salva movimento
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}