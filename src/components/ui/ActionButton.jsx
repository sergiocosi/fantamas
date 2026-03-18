export default function ActionButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-[24px] px-5 py-5 text-left border shadow-sm transition hover:shadow-md font-medium ${className}`}
    >
      {children}
    </button>
  );
}