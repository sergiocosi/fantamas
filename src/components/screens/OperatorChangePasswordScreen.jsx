import { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';
import { supabase } from '../../supabase';

export default function OperatorChangePasswordScreen({
  currentUser,
  setScreen,
}) {
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleChangePassword() {
    if (!currentUser) {
      alert('Operatore non trovato');
      return;
    }

    if (!currentPasswordInput.trim()) {
      alert('Inserisci la password attuale');
      return;
    }

    if (currentPasswordInput.trim() !== String(currentUser.password || '').trim()) {
      alert('Password attuale non corretta');
      return;
    }

    if (!newPasswordInput.trim()) {
      alert('Inserisci la nuova password');
      return;
    }

    if (newPasswordInput.trim().length < 4) {
      alert('La nuova password deve contenere almeno 4 caratteri');
      return;
    }

    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      alert('Le due password non coincidono');
      return;
    }

    if (newPasswordInput.trim() === currentPasswordInput.trim()) {
      alert('La nuova password deve essere diversa da quella attuale');
      return;
    }

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('operators')
        .update({
          password: newPasswordInput.trim(),
        })
        .eq('id', currentUser.id);

      if (error) {
        throw error;
      }

      alert('Password operatore aggiornata con successo');

      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');

      setScreen('operator-home');
    } catch (error) {
      console.error('Errore cambio password operatore:', error);
      alert('Errore durante il cambio password operatore');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Shell
      title={`Cambio password: ${currentUser?.name || currentUser?.username || 'Operatore'}`}
      onBack={() => setScreen('operator-home')}
    >
      <Card>
        <div className="grid gap-3">
          <label>
            <div className="mb-2 font-semibold">Password attuale</div>
            <input
              type="password"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              placeholder="Inserisci la password attuale"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChangePassword();
              }}
              className="w-full rounded-xl border border-neutral-300 px-3 py-3"
            />
          </label>

          <label>
            <div className="mb-2 font-semibold">Nuova password</div>
            <input
              type="password"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="Inserisci la nuova password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChangePassword();
              }}
              className="w-full rounded-xl border border-neutral-300 px-3 py-3"
            />
          </label>

          <label>
            <div className="mb-2 font-semibold">Conferma nuova password</div>
            <input
              type="password"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              placeholder="Conferma la nuova password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChangePassword();
              }}
              className="w-full rounded-xl border border-neutral-300 px-3 py-3"
            />
          </label>
        </div>
      </Card>

      <div className="grid gap-3 mt-4">
        <ActionButton onClick={handleChangePassword}>
          {isSaving ? 'Salvataggio...' : 'Salva nuova password'}
        </ActionButton>

        <ActionButton variant="secondary" onClick={() => setScreen('operator-home')}>
          Annulla
        </ActionButton>
      </div>
    </Shell>
  );
}