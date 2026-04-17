import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
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
                to="/impact"
                className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-semibold tracking-tight"
              >
                Impact
              </Link>
              <Link
                to="/how-it-works"
                className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-semibold tracking-tight"
              >
                How it Works
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="hidden lg:block text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-semibold tracking-tight"
            >
              Log In
            </Link>
            <Link
              to="/create-project"
              className="signature-gradient text-on-primary px-6 py-2.5 rounded-full font-headline text-sm font-bold tracking-tight hover:opacity-90 transition-all active:scale-95"
            >
              Start a Project
            </Link>
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
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            home
          </span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
            Home
          </span>
        </Link>
        <Link
          to="/discover"
          className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
            Discover
          </span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">person_outline</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
