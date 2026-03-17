import Shell from '../ui/Shell';

export default function BoyCategoriesScreen({
  currentUser,
  categories,
  colorStyles,
  goBack,
  onSelectCategory,
}) {
  return (
    <Shell
      title="Scegli attività"
      subtitle="Tocca una categoria per continuare."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map(category => (
          <button
            key={category.key}
            type="button"
            onClick={() => onSelectCategory(category.key)}
            className={`rounded-3xl border p-5 text-left shadow-sm hover:scale-[1.01] transition ${
              colorStyles[category.color] || ''
            }`}
          >
            <div className="text-4xl mb-3">{category.icon}</div>
            <div className="text-xl font-semibold">{category.label}</div>
            <div className="text-sm opacity-80 mt-1">{category.items.length} attività</div>
          </button>
        ))}
      </div>
    </Shell>
  );
}