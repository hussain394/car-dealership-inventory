export const Spinner = ({ className = '' }: { className?: string }) => (
  <div
    className={`h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 ${className}`}
    role="status"
    aria-label="Loading"
  />
);
