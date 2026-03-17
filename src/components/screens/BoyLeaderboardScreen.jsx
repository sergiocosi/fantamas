import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function BoyLeaderboardScreen({
  currentUser,
  leaderboard,
  goBack,
}) {
  return (
    <Shell
      title="Classifica"
      subtitle="Punteggio totale demo."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-4xl grid gap-3">
        {leaderboard.map((item, index) => (
          <Card
            key={item.id}
            className={item.id === currentUser.id ? 'border-orange-300 bg-orange-50 shadow-lg' : ''}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-lg">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{item.name}</div>
                  {item.id === currentUser.id && (
                    <div className="text-sm text-neutral-600">Questo sei tu</div>
                  )}
                </div>
              </div>
              <div className="text-2xl font-black text-orange-600">{item.points}</div>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}