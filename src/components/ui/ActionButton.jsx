export default function ActionButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-[24px] px-5 py-5 text-left border border-neutral-200 shadow-sm bg-white hover:bg-neutral-50 hover:shadow-md transition font-medium ${className}`}
    >
      {children}
    </button>
  );
}