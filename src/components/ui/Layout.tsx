import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Home, Compass, UserCircle, LogIn, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export const Layout = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 glass-panel">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter text-primary-container font-headline"
            >
              OasisFund
            </Link>
            <div className="hidden md:flex gap-8">
              <Link
                to="/"
                className="text-primary-container border-b-2 border-primary-container pb-1 font-headline text-sm font-semibold tracking-tight"
              >
                Explore
              </Link>
              <Link
               to="/start-a-project"
                className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-semibold tracking-tight"
              >
                Start a Project
              </Link>
            </div>
          </div>

          {/* Desktop Auth Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="h-10 w-10 rounded-full bg-primary overflow-hidden flex items-center justify-center shadow-sm border border-outline-variant/10 hover:ring-2 hover:ring-primary/30 transition-all"
                >
                  {user?.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-sm font-black text-on-primary font-headline">
                      {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-bold tracking-tight"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-on-primary hover:bg-primary/90 px-6 py-2 rounded-full font-headline text-sm font-bold tracking-tight transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-24 md:pb-0">
        <Outlet />
      </main>

      <footer className="w-full mt-auto bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <span className="text-lg font-bold text-on-surface font-headline">
              OasisFund
            </span>
            <p className="font-body text-sm text-on-surface-variant mt-2">
              © 2026 OasisFund. Designed for Impact.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/privacy"
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              to="/help"
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
            >
              Help Center
            </Link>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 glass-panel shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-3xl md:hidden z-50">
        <Link
          to="/"
          className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-2xl px-5 py-2 active:scale-90 transition-transform"
        >
          <Home className="w-6 h-6" />
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
            Home
          </span>
        </Link>
        <Link
          to="/discover"
          className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-transform"
        >
          <Compass className="w-6 h-6" />
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
            Discover
          </span>
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-transform"
            >
              <UserCircle className="w-6 h-6" />
              <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
                Profile
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center text-on-surface-variant hover:text-error px-5 py-2 active:scale-90 transition-transform cursor-pointer"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
                Log Out
              </span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-transform"
          >
            <LogIn className="w-6 h-6" />
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
              Log In
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Layout;
