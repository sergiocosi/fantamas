import Shell from '../ui/Shell';
import ActionButton from '../ui/ActionButton';
import Pill from '../ui/Pill';

export default function BoyItemsScreen({
  currentUser,
  selectedCategoryData,
  goBack,
  onSelectRule,
}) {
  return (
    <Shell
      title={selectedCategoryData.label}
      subtitle="Scegli cosa hai fatto."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="grid gap-3 max-w-4xl">
        {selectedCategoryData.items.map(rule => (
          <ActionButton
            key={rule.id}
            onClick={() => onSelectRule(rule.id)}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{rule.label}</div>
                <div className="text-sm text-neutral-600">
                  Richiesta da confermare dall’operatore
                </div>
              </div>
              <Pill className="bg-emerald-100 border-emerald-200 text-emerald-800">
                +{rule.points}
              </Pill>
            </div>
          </ActionButton>
        ))}
      </div>
    </Shell>
  );
}