export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-[28px] shadow-md border border-neutral-200 p-6 ${className}`}>
      {children}
    </div>
  );
}