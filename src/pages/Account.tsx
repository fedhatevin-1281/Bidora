import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { auctions } from '../data/auctions';

const sym = { USD: '$', EUR: '€', GBP: '£' };

const navItems = [
  { to: '/account', label: 'Overview', icon: '◉', exact: true },
  { to: '/account/bids', label: 'My Bids', icon: '⚡' },
  { to: '/account/watchlist', label: 'Watchlist', icon: '♡' },
  { to: '/account/won', label: 'Won Auctions', icon: '🏆' },
  { to: '/account/payments', label: 'Payments', icon: '💳' },
  { to: '/account/profile', label: 'Profile', icon: '👤' },
  { to: '/account/settings', label: 'Settings', icon: '⚙️' },
];

export function AccountLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)]">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-semibold text-sm">JD</div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">John Doe</p>
                <p className="text-xs text-[var(--muted-foreground)]">john@example.com</p>
              </div>
            </div>
            <nav className="flex flex-col gap-0.5">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius)] text-sm transition-colors ${
                      isActive
                        ? 'bg-[var(--secondary)] font-medium text-[var(--foreground)]'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden w-full">
          <div className="flex overflow-x-auto gap-2 pb-3 mb-6 border-b border-[var(--border)]">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </div>

        {/* Content */}
        <div className="hidden lg:block flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function AccountOverview() {
  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Account Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Bids', value: '3', color: 'text-blue-500' },
          { label: 'Watchlist', value: '7', color: 'text-red-500' },
          { label: 'Won Auctions', value: '2', color: 'text-green-500' },
          { label: 'Pending Payment', value: '1', color: 'text-orange-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
            <p className={`text-2xl font-bold font-mono mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Recent Activity</h2>
        {auctions.slice(0, 3).map(a => {
          const s = sym[a.currency];
          return (
            <div key={a.id} className="flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0">
              <img src={a.images[0]} alt="" className="w-12 h-9 object-cover rounded bg-[var(--muted)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)] truncate">{a.title}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Bid: {s}{a.currentBid.toLocaleString()}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                a.status === 'live' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
              }`}>
                {a.status === 'live' ? 'Active' : 'Outbid'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AccountBids() {
  const [tab, setTab] = useState<'active' | 'outbid' | 'won' | 'ended'>('active');
  const tabs = [
    { key: 'active', label: 'Active' },
    { key: 'outbid', label: 'Outbid' },
    { key: 'won', label: 'Won' },
    { key: 'ended', label: 'Ended' },
  ] as const;

  const items = auctions.slice(0, 4).map((a, i) => ({
    ...a,
    myBid: a.currentBid - i * 500,
    bidStatus: i === 0 ? 'active' : i === 1 ? 'outbid' : i === 2 ? 'won' : 'ended',
  }));

  const filtered = items.filter(a => a.bidStatus === tab);

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">My Bids</h1>
      <div className="flex gap-1 bg-[var(--secondary)] p-1 rounded-[var(--radius)] mb-6 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${tab === t.key ? 'bg-[var(--background)] shadow-sm text-[var(--foreground)] font-medium' : 'text-[var(--muted-foreground)]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
          <p className="text-[var(--muted-foreground)]">No {tab} bids.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(a => {
            const s = sym[a.currency];
            return (
              <div key={a.id} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex items-center gap-4">
                <img src={a.images[0]} alt="" className="w-20 h-14 object-cover rounded bg-[var(--muted)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--foreground)] text-sm truncate">{a.title}</p>
                  <div className="flex gap-4 mt-1.5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">Your bid</p>
                      <p className="font-mono font-semibold text-sm text-[var(--foreground)]">{s}{a.myBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">Current bid</p>
                      <p className="font-mono font-semibold text-sm text-[var(--foreground)]">{s}{a.currentBid.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                    a.bidStatus === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                    a.bidStatus === 'outbid' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                    a.bidStatus === 'won' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-[var(--secondary)] text-[var(--muted-foreground)]'
                  }`}>{a.bidStatus}</span>
                  {a.bidStatus === 'outbid' && (
                    <Link to={`/auctions/${a.id}`} className="text-xs text-[var(--accent)] font-medium">Increase Bid</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AccountWon() {
  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Won Auctions</h1>
      <div className="flex flex-col gap-4">
        {auctions.slice(0, 2).map(a => {
          const s = sym[a.currency];
          return (
            <div key={a.id} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img src={a.images[0]} alt="" className="w-full sm:w-28 h-20 object-cover rounded bg-[var(--muted)]" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--foreground)] mb-0.5">{a.title}</p>
                <p className="text-xs text-[var(--muted-foreground)] mb-2">{a.location}, {a.country}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">Winning bid</p>
                    <p className="font-mono font-bold text-[var(--foreground)]">{s}{a.currentBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">Payment</p>
                    <p className="text-sm text-orange-500 font-medium">Pending</p>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto">
                Complete Payment
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AccountPayments() {
  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Payments</h1>
      <div className="border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--secondary)]">
            <tr>
              {['Auction', 'Amount', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auctions.slice(0, 3).map((a, i) => {
              const s = sym[a.currency];
              const statuses = ['Paid', 'Pending', 'Paid'];
              const statusColors = ['text-green-600', 'text-orange-500', 'text-green-600'];
              return (
                <tr key={a.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--foreground)] truncate max-w-[180px]">{a.title}</td>
                  <td className="px-4 py-3 font-mono text-[var(--foreground)]">{s}{a.currentBid.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-medium ${statusColors[i]}`}>{statuses[i]}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">Sep {15 + i * 3}, 2026</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AccountProfile() {
  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Profile</h1>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[var(--border)]">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">JD</div>
          <div>
            <p className="font-semibold text-[var(--foreground)]">John Doe</p>
            <p className="text-sm text-[var(--muted-foreground)]">Member since Jan 2025</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['First Name', 'John'], ['Last Name', 'Doe'], ['Email', 'john@example.com'], ['Phone', '+1 555 000 0000'], ['Country', 'United States'], ['City', 'Los Angeles']].map(([label, value]) => (
            <div key={label}>
              <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{label}</label>
              <input defaultValue={value} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            </div>
          ))}
        </div>
        <button className="mt-5 px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export function AccountSettings() {
  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Settings</h1>
      <div className="flex flex-col gap-4 max-w-lg">
        {[
          { label: 'Email Notifications', desc: 'Get notified when you\'re outbid or an auction ends.' },
          { label: 'Outbid Alerts', desc: 'Receive instant alerts when someone outbids you.' },
          { label: 'Newsletter', desc: 'Weekly auction updates and featured listings.' },
        ].map((s, i) => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-[var(--foreground)]">{s.label}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
              <div className="w-10 h-5 bg-[var(--border)] rounded-full peer peer-checked:bg-[var(--accent)] transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 mt-2">
          <p className="font-medium text-sm text-[var(--foreground)] mb-3">Change Password</p>
          <div className="flex flex-col gap-3">
            {['Current Password', 'New Password', 'Confirm Password'].map(f => (
              <input key={f} type="password" placeholder={f} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            ))}
            <button className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity w-fit">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
