import { Link } from 'react-router-dom';
import { auctions, bids } from '../../data/auctions';

const sym = { USD: '$', EUR: '€', GBP: '£' };

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function AdminDashboard() {
  const live = auctions.filter(a => a.status === 'live').length;
  const scheduled = auctions.filter(a => a.status === 'scheduled').length;
  const sold = auctions.filter(a => a.status === 'sold').length;
  const totalBids = bids.length + 87;

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Live Auctions', value: live, color: 'text-green-500' },
          { label: 'Scheduled', value: scheduled, color: 'text-blue-500' },
          { label: 'Sold', value: 12, color: 'text-[var(--accent)]' },
          { label: 'Total Users', value: 1842, color: 'text-purple-500' },
          { label: 'Total Bids', value: totalBids, color: 'text-[var(--foreground)]' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value.toLocaleString()}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Auctions */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Recent Auctions</h2>
            <Link to="/adminsite/auctions" className="text-xs text-[var(--accent)]">View all</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[var(--secondary)]">
              <tr>
                <th className="text-left px-4 py-2 text-xs text-[var(--muted-foreground)]">Auction</th>
                <th className="text-right px-4 py-2 text-xs text-[var(--muted-foreground)]">Bid</th>
                <th className="text-right px-4 py-2 text-xs text-[var(--muted-foreground)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {auctions.slice(0, 5).map(a => {
                const s = sym[a.currency];
                return (
                  <tr key={a.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-2.5">
                      <p className="text-[var(--foreground)] text-xs truncate max-w-[160px]">{a.title}</p>
                      <p className="text-[var(--muted-foreground)] text-[10px]">{a.location}</p>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[var(--foreground)] text-xs">{s}{a.currentBid.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                        a.status === 'live' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        a.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-[var(--secondary)] text-[var(--muted-foreground)]'
                      }`}>{a.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent Bids */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Recent Bids</h2>
            <Link to="/adminsite/bids" className="text-xs text-[var(--accent)]">View all</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[var(--secondary)]">
              <tr>
                <th className="text-left px-4 py-2 text-xs text-[var(--muted-foreground)]">Bidder</th>
                <th className="text-left px-4 py-2 text-xs text-[var(--muted-foreground)]">Auction</th>
                <th className="text-right px-4 py-2 text-xs text-[var(--muted-foreground)]">Amount</th>
                <th className="text-right px-4 py-2 text-xs text-[var(--muted-foreground)]">Time</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(bid => {
                const a = auctions.find(x => x.id === bid.auctionId);
                return (
                  <tr key={bid.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-2.5 text-[var(--foreground)] text-xs">{bid.bidderLabel}</td>
                    <td className="px-4 py-2.5 text-[var(--muted-foreground)] text-xs truncate max-w-[100px]">{a?.title?.split(' ').slice(0, 3).join(' ')}...</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[var(--foreground)] text-xs">${bid.amount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-[var(--muted-foreground)] text-xs">{timeAgo(bid.time)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pending Sellers */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 col-span-1 lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Pending Seller Verification</h2>
          {[
            { name: 'Marco Rossi', country: 'Italy', listings: 3, email: 'marco@example.com' },
            { name: 'Sarah Johnson', country: 'USA', listings: 1, email: 'sarah@example.com' },
            { name: 'Lukas Müller', country: 'Germany', listings: 2, email: 'lukas@example.com' },
          ].map(seller => (
            <div key={seller.email} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--muted-foreground)] text-xs font-semibold">
                  {seller.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{seller.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{seller.country} · {seller.listings} listing{seller.listings > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-medium text-green-600 border border-green-200 rounded hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">Verify</button>
                <button className="px-3 py-1 text-xs font-medium text-red-500 border border-red-200 rounded hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
