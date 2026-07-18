import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => (
  <div className="flex min-h-screen">
    {/* Brand panel — hidden on mobile, shown from lg breakpoint up */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-paper lg:flex">
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
          Get on the lot
        </p>
        <p className="mt-3 font-display text-3xl font-medium leading-tight">
          Register once. Browse, reserve, and manage inventory from anywhere.
        </p>

        <ul className="mt-10 flex flex-col gap-3 border-t border-paper/15 pt-6 text-sm text-paper/70">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Live stock counts, updated the moment a unit sells
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Search by make, model, category, or price range
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Admin tools for staff to manage the full lot
          </li>
        </ul>
      </div>

      <p className="relative text-xs text-paper/50">© {new Date().getFullYear()} AutoStock</p>
    </div>

    {/* Form panel */}
    <div className="flex w-full items-center justify-center bg-paper px-6 py-12 lg:w-1/2">
      <RegisterForm />
    </div>
  </div>
);
