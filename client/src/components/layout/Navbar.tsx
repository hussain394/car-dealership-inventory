import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link to="/" className="text-lg font-semibold text-slate-900">
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
