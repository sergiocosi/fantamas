import Shell from '../ui/Shell';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { PRIZE } from '../../utils/appHelpers';

function SmallTile({ emoji, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl border border-neutral-200 bg-white px-4 py-4 text-left shadow-sm hover:shadow-md hover:bg-orange-50 transition"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-semibold leading-tight">{label}</div>
    </button>
  );
}

export default function BoyHomeScreen({
  currentUser,
  myPoints,
  myPosition,
  myRequests,
  prizeStatus,
  goBack,
  goToCategories,
  goToLeaderboard,
  goToRequests,
  goToChangePassword,
  goToAvatar,
}) {
  const pendingCount = myRequests.filter(request => request.status === 'pending').length;

  return (
    <Shell>
      <div className="flex items-center justify-between gap-3 mb-5">
        <button type="button" onClick={goToAvatar} className="flex items-center gap-3 min-w-0 text-left">
          <Avatar user={currentUser} size="lg" />
          <div className="min-w-0">
            <div className="text-2xl md:text-3xl font-black truncate">Ciao, {currentUser.name}!</div>
            <div className="text-sm text-neutral-500">Ogni aiuto vale punti.</div>
          </div>
        </button>
        <button
          onClick={goBack}
          className="rounded-2xl px-3 py-2 bg-white border border-neutral-200 text-neutral-600 hover:text-rose-600 hover:border-rose-200 text-sm font-semibold shrink-0"
        >
          Esci
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 max-w-5xl">
        <Card className="bg-orange-50 border-orange-200">
          <div className="text-sm text-neutral-600 mb-1 uppercase tracking-wider">Questo mese</div>
          <div className="flex items-end gap-3">
            <div className="text-6xl font-black text-orange-600 leading-none">{myPoints}</div>
            <div className="text-lg text-neutral-700 mb-1">punti</div>
          </div>
          <div className="mt-3 text-neutral-700">
            Sei <span className="font-bold">{myPosition || '-'}°</span> in classifica
            {pendingCount > 0 && (
              <span className="text-neutral-500"> · {pendingCount} {pendingCount === 1 ? 'richiesta' : 'richieste'} in attesa</span>
            )}
          </div>
        </Card>

        <Card className={prizeStatus?.inPrize ? 'bg-emerald-50 border-emerald-200' : 'bg-white'}>
          <div className="text-sm text-neutral-600 mb-1 uppercase tracking-wider">Premio del mese</div>
          <div className="text-xl font-black">
            {PRIZE.emoji} I primi {PRIZE.places} vincono {PRIZE.label}
          </div>
          {prizeStatus && <div className="mt-3 text-neutral-700">{prizeStatus.text}</div>}
        </Card>

        <button
          type="button"
          onClick={goToCategories}
          className="lg:col-span-2 rounded-[28px] bg-orange-500 hover:bg-orange-600 text-white px-6 py-6 text-left shadow-md transition flex items-center gap-4"
        >
          <div className="text-5xl">➕</div>
          <div>
            <div className="text-2xl font-black">Ho fatto un'attività</div>
            <div className="text-orange-100">Tocca qui per chiedere i punti</div>
          </div>
        </button>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SmallTile emoji="🏆" label="Classifica" onClick={goToLeaderboard} />
          <SmallTile emoji="📋" label="Le mie richieste" onClick={goToRequests} />
          <SmallTile emoji="📷" label="Foto e avatar" onClick={goToAvatar} />
          <SmallTile emoji="🔒" label="Password" onClick={goToChangePassword} />
        </div>
      </div>
    </Shell>
  );
}
