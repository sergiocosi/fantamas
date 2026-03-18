import Shell from '../ui/Shell';
import Card from '../ui/Card';

export default function VisitorRulesScreen({
  currentUser,
  rules,
  goBack,
}) {
  const visibleRules = rules.filter(rule => rule.boySelectable);

  return (
    <Shell
      title="Attività disponibili"
      subtitle="Bonus, malus e attività visibili ai ragazzi."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-5xl grid gap-3">
        {visibleRules.map(rule => (
          <Card key={rule.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{rule.label}</div>
                <div className="text-sm text-neutral-600">{rule.category}</div>
              </div>
              <div className="text-xl font-black text-orange-600">
                {rule.kind === 'malus' ? '' : '+'}
                {rule.points}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}