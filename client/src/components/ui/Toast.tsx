interface ToastProps {
  message: string;
  variant?: 'error' | 'success';
  onDismiss: () => void;
}

const variantClasses = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const Toast = ({ message, variant = 'error', onDismiss }: ToastProps) => (
  <div
    role="alert"
    className={`flex items-center justify-between gap-4 rounded-md border px-4 py-2 text-sm ${variantClasses[variant]}`}
  >
    <span>{message}</span>
    <button onClick={onDismiss} className="text-xs font-medium opacity-70 hover:opacity-100">
      Dismiss
    </button>
  </div>
);
