import Shell from '../ui/Shell';
import Card from '../ui/Card';
import Pill from '../ui/Pill';

export default function BoyRequestsScreen({
  currentUser,
  myRequests,
  goBack,
  statusStyles,
  formatDate,
  getStatusLabel,
}) {
  return (
    <Shell
      title="Le mie richieste"
      subtitle="Stato delle attività inviate."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="grid gap-3 max-w-4xl">
        {myRequests.length === 0 && <Card>Nessuna richiesta inviata.</Card>}

        {myRequests.map(request => (
          <Card key={request.id} className={statusStyles[request.status] || ''}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="font-bold text-lg">{request.activity}</div>
                <div className="text-sm opacity-80 mt-1">{formatDate(request.createdAt)}</div>
                {request.note && <div className="text-sm mt-2">Nota: {request.note}</div>}
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Pill className={statusStyles[request.status] || 'bg-white'}>
                  {getStatusLabel(request)}
                </Pill>
                {request.decidedBy && <div className="text-xs opacity-70">da {request.decidedBy}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}