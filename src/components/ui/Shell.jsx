export default function Shell({ children, title, subtitle, onBack, currentUser }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white text-neutral-900 px-4 py-4 md:p-8" translate="no">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 md:mb-8 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-2xl md:text-4xl font-black tracking-tight text-orange-600">FantaMas</div>
            {currentUser && <div className="text-xs md:text-sm text-neutral-500 truncate">{currentUser.name}</div>}
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-2xl px-4 py-2 bg-white border border-neutral-200 shadow-sm hover:bg-neutral-100 font-medium shrink-0"
            >
              ← Indietro
            </button>
          )}
        </div>

        {title && <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>}
        {subtitle && <div className="text-neutral-600 mt-1 md:text-lg">{subtitle}</div>}
        {(title || subtitle) && <div className="mb-5" />}
        {children}
      </div>
    </div>
  );
}
