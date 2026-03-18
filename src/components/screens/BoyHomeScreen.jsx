import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';
import Pill from '../ui/Pill';
import { getAvatarOption } from '../../data/avatars.js';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

export default function BoyHomeScreen({
  currentUser,
  myPoints,
  myPosition,
  myRequests,
  goBack,
  goToCategories,
  goToLeaderboard,
  goToRequests,
  goToChangePassword,
  goToAvatar,
}) {
  const avatarOption = getAvatarOption(currentUser?.avatar_key);

  return (
    <Shell
      title={`Ciao, ${currentUser.name}!`}
      // title={`${avatarOption ? `${avatarOption.emoji} ` : ''}Ciao, ${currentUser.name}!`}
      subtitle="Ogni aiuto vale punti."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
            {avatarOption ? (
              <div className="text-3xl">{avatarOption.emoji}</div>
            ) : (
              <div className="text-sm font-bold text-orange-700">
                {getInitials(currentUser?.name || '')}
              </div>
            )}
          </div>

          <div className="text-sm text-neutral-600">
            Profilo: <span className="font-semibold">{currentUser?.name || '—'}</span>
          </div>
        </div>

        <button
          onClick={goBack}
          className="rounded-2xl px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold shadow-sm"
        >
          Esci
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-orange-50 border-orange-200">
          <div className="text-sm text-neutral-600 mb-2 uppercase tracking-wider">I tuoi progressi</div>
          <div className="text-6xl font-black">{myPoints}</div>
          <div className="text-neutral-700 mt-2 text-lg">punti totali</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill className="bg-white">Posizione: {myPosition || '-'}</Pill>
            <Pill className="bg-white">
              Richieste in attesa: {myRequests.filter(request => request.status === 'pending').length}
            </Pill>
          </div>
        </Card>

        <div className="lg:col-span-2 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ActionButton
            onClick={goToCategories}
            className="border-orange-200 bg-orange-50 hover:bg-orange-100 text-neutral-900"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-bold">Aggiungi attività</div>
            <div className="text-sm text-neutral-600">Invia una richiesta punti</div>
          </ActionButton>

          <ActionButton
            onClick={goToLeaderboard}
            className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-neutral-900"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold">Classifica</div>
            <div className="text-sm text-neutral-600">Guarda il gruppo</div>
          </ActionButton>

          <ActionButton
            onClick={goToRequests}
            className="border-sky-200 bg-sky-50 hover:bg-sky-100 text-neutral-900"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="font-bold">Le mie richieste</div>
            <div className="text-sm text-neutral-600">Controlla lo stato</div>
          </ActionButton>

          <ActionButton
            onClick={goToChangePassword}
            className="border-violet-200 bg-violet-50 hover:bg-violet-100 text-neutral-900"
          >
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-bold">Cambia password</div>
            <div className="text-sm text-neutral-600">Aggiorna il tuo accesso</div>
          </ActionButton>

          <ActionButton
            onClick={goToAvatar}
            className="border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-neutral-900"
          >
            <div className="text-3xl mb-2">🙂</div>
            <div className="font-bold">Scegli avatar</div>
            <div className="text-sm text-neutral-600">Personalizza il tuo profilo</div>
          </ActionButton>
        </div>
      </div>
    </Shell>
  );
}