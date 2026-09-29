import { Link } from 'react-router-dom';
import { auctions } from '../data/auctions';
import { useWatchlist } from '../contexts/WatchlistContext';
import CountdownTimer from '../components/CountdownTimer';

const sym = { USD: '$', EUR: '€', GBP: '£' };

export default function Watchlist() {
  const { watchlist, toggle } = useWatchlist();
  const items = auctions.filter(a => watchlist.includes(a.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)] mb-2">Watchlist</h1>
      <p className="text-[var(--muted-foreground)] text-sm mb-8">{items.length} saved auction{items.length !== 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[var(--border)] rounded-2xl">
          <svg className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-[var(--muted-foreground)] mb-5">Your watchlist is empty.</p>
          <Link to="/auctions" className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] text-sm font-medium">
            Browse Auctions
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(a => {
            const s = sym[a.currency];
            return (
              <div key={a.id} className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
                <Link to={`/auctions/${a.id}`} className="shrink-0">
                  <img
                    src={a.images[0]}
                    alt={a.title}
                    className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-[var(--radius)] bg-[var(--muted)]"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/auctions/${a.id}`}>
                    <h3 className="font-medium text-[var(--foreground)] text-sm sm:text-base hover:text-[var(--accent)] transition-colors truncate">{a.title}</h3>
                  </Link>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{a.location}, {a.country}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">Current bid</p>
                      <p className="font-mono font-semibold text-[var(--foreground)] text-sm">{s}{a.currentBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">Ends in</p>
                      <CountdownTimer endTime={a.endTime} compact />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    to={`/auctions/${a.id}`}
                    className="px-3 py-1.5 text-xs font-medium border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-[var(--radius)] transition-colors whitespace-nowrap"
                  >
                    View Auction
                  </Link>
                  <button
                    onClick={() => toggle(a.id)}
                    className="px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
