import Shell from '../ui/Shell';
import Card from '../ui/Card';
import Pill from '../ui/Pill';

export default function OperatorHistoryScreen({
  currentUser,
  history,
  goBack,
  statusStyles,
  formatDate,
  getRequestPoints,
  getStatusLabel,
  deleteRequest,
}) {
  return (
    <Shell
      title="Storico"
      subtitle="Ultimi movimenti registrati."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="grid gap-3">
        {history.map(request => {
          const displayedPoints = getRequestPoints(request);

          return (
            <Card key={request.id}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-500">
                    {request.userName} · {formatDate(request.createdAt)}
                  </div>
                  <div className="font-semibold">{request.activity}</div>
                  {request.note && (
                    <div className="text-sm text-neutral-600">Nota: {request.note}</div>
                  )}
                  {request.decidedBy && (
                    <div className="text-xs text-neutral-500 mt-1">
                      Gestito da {request.decidedBy}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Pill className={statusStyles[request.status] || 'bg-white'}>
                    {getStatusLabel(request)}
                  </Pill>
                  <div
                    className={`font-bold text-lg ${
                      displayedPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {displayedPoints > 0 ? '+' : ''}
                    {displayedPoints}
                  </div>
                  <button
                    onClick={() => deleteRequest(request.id)}
                    className="rounded-2xl px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}