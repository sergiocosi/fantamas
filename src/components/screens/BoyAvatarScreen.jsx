import { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';
import Avatar from '../ui/Avatar';
import { AVATAR_OPTIONS } from '../../data/avatars.js';

export default function BoyAvatarScreen({
  currentUser,
  selectedAvatarKey,
  setSelectedAvatarKey,
  saveAvatar,
  uploadPhoto,
  removePhoto,
  goBack,
}) {
  const [busy, setBusy] = useState(false);
  const hasPhoto = Boolean(currentUser?.avatar_url);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    await uploadPhoto(currentUser.id, file);
    setBusy(false);
  }

  async function handleRemove() {
    setBusy(true);
    await removePhoto(currentUser.id);
    setBusy(false);
  }

  return (
    <Shell
      title="Foto e avatar"
      subtitle="Metti una tua foto oppure scegli un animale."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-5xl grid gap-6">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar user={currentUser} size="xl" />
            <div className="grid gap-3 flex-1">
              <div className="text-xl font-bold">La tua foto</div>
              <label
                className={`rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm text-center cursor-pointer ${
                  busy ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {busy ? 'Un attimo…' : hasPhoto ? '📷 Cambia foto' : '📷 Carica una foto'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
              </label>
              {hasPhoto && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={busy}
                  className="rounded-2xl px-5 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50"
                >
                  Togli la foto e usa l'animale
                </button>
              )}
            </div>
          </div>
        </Card>

        <div>
          <div className="text-xl font-bold mb-1">Oppure scegli un animale</div>
          <div className="text-sm text-neutral-600 mb-4">
            {hasPhoto
              ? "Se hai una foto si vede la foto: l'animale compare quando la togli."
              : "Tocca l'animale che ti piace e premi Salva."}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {AVATAR_OPTIONS.map(option => {
              const isSelected = selectedAvatarKey === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedAvatarKey(option.key)}
                  className={`rounded-3xl border p-3 text-center bg-white shadow-sm ${
                    isSelected ? 'border-orange-400 bg-orange-50 shadow-lg' : 'border-neutral-200'
                  }`}
                >
                  <div className="text-5xl mb-1">{option.emoji}</div>
                  <div className="text-sm font-semibold">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-sm">
          <ActionButton
            onClick={saveAvatar}
            className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
          >
            <div className="font-bold text-center">Salva animale</div>
          </ActionButton>
        </div>
      </div>
    </Shell>
  );
}
