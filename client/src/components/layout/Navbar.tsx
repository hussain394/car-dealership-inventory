import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
<nav className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white/90 px-6 py-4 backdrop-blur">
  <Link to="/" className="font-display text-xl font-semibold text-brand-800">
    AutoStock
  </Link>
  <div className="flex items-center gap-4">
    {isAdmin && (
      <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Admin
          </Link>
        )}
        <span className="text-sm text-slate-500">{user?.email}</span>
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </div>
    </nav>
  );
};
