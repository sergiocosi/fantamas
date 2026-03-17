export default function Pill({ children, className = '' }) {
  return <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium border ${className}`}>{children}</div>;
}