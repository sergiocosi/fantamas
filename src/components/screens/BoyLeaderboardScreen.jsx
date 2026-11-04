import { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { getMonthKey, shiftMonthKey, formatMonthKey, PRIZE } from '../../utils/appHelpers';

export default function BoyLeaderboardScreen({
  currentUser,
  getLeaderboard,
  goBack,
}) {
  const currentMonth = getMonthKey();
  const [monthKey, setMonthKey] = useState(currentMonth);
  const leaderboard = getLeaderboard(monthKey);
  const isCurrentMonth = monthKey === currentMonth;

  return (
    <Shell
      title="Classifica"
      subtitle={isCurrentMonth ? `Punti di ${formatMonthKey(monthKey).toLowerCase()}` : `Classifica finale di ${formatMonthKey(monthKey).toLowerCase()}`}
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-4xl flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => setMonthKey(shiftMonthKey(monthKey, -1))}
          className="px-4 py-2 rounded-2xl border border-neutral-200 bg-white font-semibold hover:bg-neutral-50"
        >
          ← Mese prima
        </button>
        <div className="font-black text-lg text-center">{formatMonthKey(monthKey)}</div>
        <button
          type="button"
          onClick={() => setMonthKey(shiftMonthKey(monthKey, 1))}
          disabled={isCurrentMonth}
          className="px-4 py-2 rounded-2xl border border-neutral-200 bg-white font-semibold hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Mese dopo →
        </button>
      </div>

      <div className="max-w-4xl grid gap-3">
        {leaderboard.map((item, index) => {
          const wins = index < PRIZE.places && item.points > 0;

          return (
            <Card
              key={item.id}
              className={item.id === currentUser.id ? 'border-orange-300 bg-orange-50 shadow-lg' : ''}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-lg shrink-0">
                    {index + 1}
                  </div>

                  <Avatar user={item} size="md" />

                  <div className="min-w-0">
                    <div className="font-semibold truncate">{item.name}</div>
                    {wins && (
                      <div className="text-sm text-emerald-700 font-semibold">
                        {PRIZE.emoji} {isCurrentMonth ? `In zona ${PRIZE.shortLabel}` : `Ha vinto ${PRIZE.label}`}
                      </div>
                    )}
                    {item.id === currentUser.id && (
                      <div className="text-sm text-neutral-600">Questo sei tu</div>
                    )}
                  </div>
                </div>

                <div className="text-2xl font-black text-orange-600 shrink-0">
                  {item.points}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}