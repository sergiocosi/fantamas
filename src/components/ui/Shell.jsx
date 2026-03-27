export default function Shell({ children, title, subtitle, onBack, onReset, currentUser }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50 text-neutral-900 p-4 md:p-8" translate="no">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-orange-600">FantaMas</div>
            <div className="text-base md:text-lg text-neutral-600 mt-1">
              {subtitle || 'Prima web app demo'}
            </div>
            {currentUser && <div className="text-sm mt-2 text-neutral-500">Accesso: {currentUser.name}</div>}
          </div>
          <div className="flex flex-wrap gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-2xl px-4 py-2.5 bg-white border border-neutral-200 shadow-sm hover:bg-neutral-100 font-medium"
              >
                ← Indietro
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="rounded-2xl px-4 py-2.5 bg-white border border-neutral-200 shadow-sm hover:bg-neutral-100 font-medium"
              >
                Reset demo
              </button>
            )}
          </div>
        </div>
        {title && <h1 className="text-3xl md:text-4xl font-bold mb-5">{title}</h1>}
        {children}
      </div>
    </div>
  );
}