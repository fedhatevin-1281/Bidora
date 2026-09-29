import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { to: '/adminsite/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/adminsite/auctions', label: 'Auctions', icon: '🔨' },
  { to: '/adminsite/auctions/create', label: 'Create Auction', icon: '+' },
  { to: '/adminsite/bids', label: 'Bids', icon: '⚡' },
  { to: '/adminsite/users', label: 'Users', icon: '👥' },
  { to: '/adminsite/sellers', label: 'Sellers', icon: '🏪' },
  { to: '/adminsite/documents', label: 'Documents', icon: '📄' },
  { to: '/adminsite/payments', label: 'Payments', icon: '💳' },
  { to: '/adminsite/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[var(--card)] border-r border-[var(--border)] transition-all ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className={`flex items-center gap-2 h-16 px-4 border-b border-[var(--border)] shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          {!collapsed && (
            <span className="font-semibold text-[var(--foreground)] text-sm">Admin Panel</span>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="ml-auto p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
          </button>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/adminsite/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--secondary)] text-[var(--foreground)] font-medium'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className={`p-3 border-t border-[var(--border)] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <span className="text-xs text-[var(--muted-foreground)]">{theme === 'dark' ? 'Dark' : 'Light'}</span>}
          <button onClick={toggleTheme} className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center px-4 sm:px-6 gap-4 shrink-0">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1 text-[var(--muted-foreground)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-sm font-semibold text-[var(--foreground)]">AuctionHub Admin</span>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">← Public Site</Link>
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-semibold">A</div>
          </div>
        </header>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative w-56 bg-[var(--card)] h-full">
              <div className="h-16 flex items-center px-4 border-b border-[var(--border)]">
                <span className="font-semibold text-[var(--foreground)]">Admin Panel</span>
              </div>
              <nav className="py-3">
                {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm ${isActive ? 'bg-[var(--secondary)] font-medium text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`
                    }
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
