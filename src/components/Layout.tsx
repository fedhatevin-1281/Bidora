import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors text-sm"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <div className="w-8 h-8 bg-[var(--accent)] rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm font-serif">A</span>
      </div>
      <span className="font-semibold text-[var(--foreground)] tracking-tight text-lg">AuctionHub</span>
    </Link>
  );
}

const navLinks = [
  { to: '/auctions', label: 'Auctions' },
  { to: '/auctions?category=cars', label: 'Cars' },
  { to: '/auctions?category=houses', label: 'Properties' },
  { to: '/sell', label: 'Sell' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6 flex-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'text-[var(--foreground)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <ThemeToggle />

            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/account" className="px-4 py-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                    My Account
                  </Link>
                  <button onClick={signOut} className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] hover:opacity-90 transition-opacity">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setAuthOpen(true)} className="px-4 py-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => setAuthOpen(true)} className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] hover:opacity-90 transition-opacity">
                    Create Account
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search bar expansion */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={e => { e.preventDefault(); const q = (e.target as HTMLFormElement).q.value; navigate(`/auctions?q=${q}`); setSearchOpen(false); }}>
              <input
                name="q"
                autoFocus
                className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Search cars, properties, locations..."
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-[var(--border)] pt-3">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-md"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[var(--border)]">
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-center border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)]">
                    My Account
                  </Link>
                  <button onClick={() => { signOut(); setMenuOpen(false); }} className="px-4 py-2.5 text-sm text-center font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)]">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthOpen(true); setMenuOpen(false); }} className="px-4 py-2.5 text-sm text-center border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)]">
                    Sign In
                  </button>
                  <button onClick={() => { setAuthOpen(true); setMenuOpen(false); }} className="px-4 py-2.5 text-sm text-center font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)]">
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </header>
  );
}

export function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-[var(--muted-foreground)] max-w-xs leading-relaxed">
              Trusted online auction marketplace for vehicles and properties across the USA and Europe.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Auctions</h4>
            <ul className="space-y-2">
              {['All Auctions', 'Cars', 'Motorcycles', 'Commercial Vehicles', 'Properties', 'Land'].map(item => (
                <li key={item}><Link to="/auctions" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Platform</h4>
            <ul className="space-y-2">
              {['Sell With Us', 'How It Works', 'About Us', 'Support'].map(item => (
                <li key={item}><Link to="/sell" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Auction Rules', 'Contact'].map(item => (
                <li key={item}><Link to="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)]">© 2026 AuctionHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <select className="text-xs bg-transparent text-[var(--muted-foreground)] border border-[var(--border)] rounded px-2 py-1.5">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <select className="text-xs bg-transparent text-[var(--muted-foreground)] border border-[var(--border)] rounded px-2 py-1.5">
              <option>English</option>
            </select>
            <button onClick={toggleTheme} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
