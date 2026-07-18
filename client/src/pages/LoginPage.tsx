import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => (
  <div className="flex min-h-screen">
    {/* Brand panel — hidden on mobile, shown from lg breakpoint up */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-paper lg:flex">
      {/* subtle dot-grid texture, dealership-lot marker motif */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #EEF0EA 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <span className="relative font-display text-xl font-semibold uppercase tracking-wide">
        Auto<span className="text-amber-400">Stock</span>
      </span>

      <div className="relative max-w-sm">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400">
          Inventory, on the record
        </p>
        <p className="mt-3 font-display text-3xl font-medium leading-tight">
          Every unit on the lot, tracked to the last one in stock.
        </p>

        <div className="mt-10 flex gap-8 border-t border-paper/15 pt-6 font-mono">
          <div>
            <p className="text-2xl font-semibold text-amber-400">1.2k+</p>
            <p className="text-xs uppercase tracking-wide text-paper/60">Units tracked</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-amber-400">99.9%</p>
            <p className="text-xs uppercase tracking-wide text-paper/60">Stock accuracy</p>
          </div>
        </div>
      </div>

      <p className="relative text-xs text-paper/50">© {new Date().getFullYear()} AutoStock</p>
    </div>

    {/* Form panel */}
<div className="flex w-full items-center justify-center bg-gradient-to-b from-paper to-amber-50/40 px-6 py-12 lg:w-1/2">      <LoginForm />
    </div>
  </div>
);