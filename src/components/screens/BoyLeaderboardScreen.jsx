import Shell from '../ui/Shell';
import Card from '../ui/Card';
import { getAvatarOption } from '../../data/avatars';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

export default function BoyLeaderboardScreen({
  currentUser,
  leaderboard,
  goBack,
}) {
  return (
    <Shell
      title="Classifica"
      subtitle="Punteggio totale"
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-4xl grid gap-3">
        {leaderboard.map((item, index) => {
          const avatarOption = getAvatarOption(item.avatar_key);

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

                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-700 shrink-0">
                    {avatarOption ? (
                      <div className="text-2xl">{avatarOption.emoji}</div>
                    ) : item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={event => {
                          event.currentTarget.style.display = 'none';
                          const fallback = event.currentTarget.nextSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    <div
                      className="w-full h-full items-center justify-center"
                      style={{ display: avatarOption || item.avatar_url ? 'none' : 'flex' }}
                    >
                      {getInitials(item.name)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold truncate">{item.name}</div>
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