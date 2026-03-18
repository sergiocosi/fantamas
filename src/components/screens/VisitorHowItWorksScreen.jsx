import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function VisitorHowItWorksScreen({
  currentUser,
  goBack,
}) {
  return (
    <Shell
      title="Come funziona"
      subtitle="Una panoramica semplice del progetto."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-4xl grid gap-4">
        <Card>
          <div className="font-bold text-lg mb-2">1. I ragazzi partecipano</div>
          <p className="text-neutral-700">
            I ragazzi svolgono attività utili e positive all’interno del progetto.
          </p>
        </Card>

        <Card>
          <div className="font-bold text-lg mb-2">2. Le attività valgono punti</div>
          <p className="text-neutral-700">
            Ogni attività può assegnare bonus oppure, in alcuni casi, malus.
          </p>
        </Card>

        <Card>
          <div className="font-bold text-lg mb-2">3. Gli operatori verificano</div>
          <p className="text-neutral-700">
            Le richieste vengono controllate dagli operatori, che possono approvarle, modificarle o rifiutarle.
          </p>
        </Card>

        <Card>
          <div className="font-bold text-lg mb-2">4. La classifica si aggiorna</div>
          <p className="text-neutral-700">
            I punteggi approvati contribuiscono alla classifica generale del gruppo.
          </p>
        </Card>

        <Card>
          <div className="font-bold text-lg mb-2">5. L’area visitatore è solo consultazione</div>
          <p className="text-neutral-700">
            Il visitatore può osservare l’andamento del progetto, ma non può inviare richieste o modificare dati.
          </p>
        </Card>
      </div>
    </Shell>
  );
}