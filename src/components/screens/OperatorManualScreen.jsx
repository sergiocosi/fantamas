import { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

function PhotoCard({ boys, uploadPhoto, removePhoto }) {
  const [boyId, setBoyId] = useState('');
  const [busy, setBusy] = useState(false);
  const boy = boys.find(item => item.id === boyId);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !boyId) return;
    setBusy(true);
    await uploadPhoto(boyId, file);
    setBusy(false);
  }

  async function handleRemove() {
    if (!boy || !window.confirm(`Togliere la foto di ${boy.name}?`)) return;
    setBusy(true);
    await removePhoto(boyId);
    setBusy(false);
  }

  return (
    <Card>
      <div className="text-2xl font-black mb-5">📷 Foto dei ragazzi</div>
      <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-center">
        <Avatar user={boy} size="xl" />
        <div className="grid gap-3">
          <select
            value={boyId}
            onChange={event => setBoyId(event.target.value)}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
          >
            <option value="">Seleziona un ragazzo</option>
            {boys.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.avatar_url ? ' 📷' : ''}
              </option>
            ))}
          </select>
          <label
            className={`rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm text-center cursor-pointer ${
              !boyId || busy ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {busy ? 'Un attimo…' : boy?.avatar_url ? 'Cambia foto' : 'Carica foto'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={!boyId || busy} />
          </label>
          {boy?.avatar_url && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="rounded-2xl px-5 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50"
            >
              Togli foto
            </button>
          )}
        </div>
      </div>
      <div className="text-sm text-neutral-500 mt-4">
        Le foto sono visibili a ragazzi, operatori e famiglie. Usale solo per chi ha dato il consenso.
      </div>
    </Card>
  );
}

function FamilyLinkCard({ createFamilyLink }) {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    const created = await createFamilyLink();
    if (created) {
      setLink(created);
      setCopied(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      alert('Copia non riuscita: tieni premuto sul link e copialo a mano.');
    }
  }

  return (
    <Card>
      <div className="text-2xl font-black mb-2">👨‍👩‍👧 Link per le famiglie</div>
      <div className="text-neutral-600 mb-4">
        Un link da mandare su WhatsApp: chi lo apre entra in modalità visitatore (classifica e attività) senza
        scrivere nessuna password. Vale un anno.
      </div>
      {!link ? (
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
        >
          Crea link
        </button>
      ) : (
        <div className="grid gap-3">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm break-all select-all">{link}</div>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
          >
            {copied ? '✓ Copiato!' : 'Copia link'}
          </button>
        </div>
      )}
    </Card>
  );
}


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
  addArbitraryManualAdjustment,
  uploadPhoto,
  removePhoto,
  createFamilyLink,
  goBack,
  section = 'points',
}) {
  const operatorRules = appState.rules.filter(
    rule => !rule.boySelectable || rule.kind === 'bonus'
  );

  const boys = appState.users.filter(user => user.role === 'boy');

  const [selectedAdjustmentUserId, setSelectedAdjustmentUserId] = useState('');
  const [adjustmentPointsInput, setAdjustmentPointsInput] = useState('');
  const [adjustmentReasonInput, setAdjustmentReasonInput] = useState('');

  function addManualAdjustment() {
  const userId = selectedAdjustmentUserId.trim();
  const points = Number(adjustmentPointsInput);
  const reason = adjustmentReasonInput.trim();

  if (!userId) {
    alert('Seleziona un ragazzo');
    return;
  }

  if (!Number.isFinite(points) || points === 0) {
    alert('Inserisci un numero valido diverso da 0');
    return;
  }

  addArbitraryManualAdjustment({
    userId,
    points,
    reason,
  });

  setSelectedAdjustmentUserId('');
  setAdjustmentPointsInput('');
  setAdjustmentReasonInput('');
}

if (section === 'manage') {
  return (
    <Shell
      title="Gestione ragazzi e regole"
      subtitle="Aggiungi, modifica o elimina ragazzi e attività."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-3xl grid gap-6">
        <Card>
          <div className="text-2xl font-black mb-5">🧑‍🤝‍🧑 Ragazzi</div>
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
                className="rounded-2xl px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-sm"
              >
                Salva modifica ragazzo
              </button>
            </div>
          </div>
        </div>

        <div>
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
        </Card>

        <PhotoCard boys={boys} uploadPhoto={uploadPhoto} removePhoto={removePhoto} />

        <Card>
          <div className="text-2xl font-black mb-5">📚 Regole</div>
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

        <div>
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
                className="rounded-2xl px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-sm"
              >
                Salva modifica regola
              </button>
            </div>
          </div>
        </div>
        </Card>

        <FamilyLinkCard createFamilyLink={createFamilyLink} />
      </div>
    </Shell>
  );
}

return (
  <Shell
    title="Punti extra"
    subtitle="Bonus e malus decisi dagli operatori."
    onBack={goBack}
    currentUser={currentUser}
  >
    <div className="max-w-3xl">
      <Card>
        <div className="mb-6 pb-6 border-b border-neutral-200">
          <div className="text-lg font-bold mb-3">Bonus / Malus manuale</div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-neutral-700">Ragazzo</label>
              <select
                value={selectedAdjustmentUserId}
                onChange={event => setSelectedAdjustmentUserId(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
              >
                <option value="">Seleziona ragazzo</option>
                {boys.map(boy => (
                  <option key={boy.id} value={boy.id}>
                    {boy.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700">Punti</label>
              <input
                type="number"
                value={adjustmentPointsInput}
                onChange={event => setAdjustmentPointsInput(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Es. 5 oppure -3"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-neutral-700">Motivo</label>
            <input
              type="text"
              value={adjustmentReasonInput}
              onChange={event => setAdjustmentReasonInput(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
              placeholder="Es. bonus speciale, comportamento, aiuto a un compagno..."
            />
          </div>

          <div className="mt-4">
            <button
              onClick={addManualAdjustment}
              className="rounded-2xl px-5 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold shadow-sm"
            >
              Applica bonus / malus
            </button>
          </div>
        </div>

        <div>
          <div className="text-lg font-bold mb-3">Punti da una regola</div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-neutral-700">Ragazzo</label>
              <select
                value={operatorTargetUserId}
                onChange={event => setOperatorTargetUserId(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
              >
                <option value="">Seleziona ragazzo</option>
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
                <option value="">Seleziona voce</option>
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

          <div className="mt-4">
            <button
              onClick={addManualOperatorEntry}
              className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
            >
              Salva movimento
            </button>
          </div>
        </div>
      </Card>
    </div>
  </Shell>
);
}
