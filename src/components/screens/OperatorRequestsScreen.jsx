import Shell from '../ui/Shell';
import Card from '../ui/Card';
import Pill from '../ui/Pill';

export default function OperatorRequestsScreen({
  currentUser,
  pendingRequests,
  modifyDraft,
  setModifyDraft,
  decideRequest,
  startModify,
  saveModify,
  goBack,
  formatDate,
}) {
  return (
    <Shell
      title="Richieste da verificare"
      subtitle="Conferma le attività inviate dai ragazzi."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="grid gap-3">
        {pendingRequests.length === 0 && <Card>Nessuna richiesta in attesa.</Card>}

        {pendingRequests.map(request => (
          <Card key={request.id}>
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Pill className="bg-orange-50 border-orange-200 text-orange-700">
                    {request.userName}
                  </Pill>
                  <Pill className="bg-emerald-50 border-emerald-200 text-emerald-700">
                    {request.points > 0 ? '+' : ''}{request.points} punti
                  </Pill>
                </div>

                <div className="text-xl font-bold">{request.activity}</div>
                <div className="text-sm text-neutral-600 mt-1">
                  {formatDate(request.createdAt)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-md">
                <button
                  onClick={() => decideRequest(request.id, 'approve')}
                  className="rounded-2xl px-4 py-2 bg-emerald-600 text-white font-semibold shadow-sm"
                >
                  Approva
                </button>

                <button
                  onClick={() => startModify(request)}
                  className="rounded-2xl px-4 py-2 bg-sky-600 text-white font-semibold shadow-sm"
                >
                  Modifica
                </button>

                <button
                  onClick={() => decideRequest(request.id, 'reject')}
                  className="rounded-2xl px-4 py-2 bg-rose-600 text-white font-semibold shadow-sm"
                >
                  Rifiuta
                </button>
              </div>
            </div>

            {modifyDraft.requestId === request.id && (
              <div className="mt-4 border-t pt-4 grid md:grid-cols-[140px_1fr_auto] gap-3 items-end">
                <div>
                  <label className="text-sm text-neutral-600">Punti finali</label>
                  <input
                    value={modifyDraft.finalPoints}
                    onChange={event =>
                      setModifyDraft(previous => ({
                        ...previous,
                        finalPoints: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-2xl border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-600">Nota</label>
                  <input
                    value={modifyDraft.note}
                    onChange={event =>
                      setModifyDraft(previous => ({
                        ...previous,
                        note: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-2xl border px-3 py-2"
                  />
                </div>

                <button
                  onClick={saveModify}
                  className="rounded-2xl px-4 py-2 bg-slate-900 text-white"
                >
                  Salva modifica
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Shell>
  );
}