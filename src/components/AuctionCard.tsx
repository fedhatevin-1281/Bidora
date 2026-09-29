import { Link } from 'react-router-dom';
import type { Auction } from '../data/auctions';
import CountdownTimer from './CountdownTimer';
import { useWatchlist } from '../contexts/WatchlistContext';

interface Props {
  auction: Auction;
}

const statusBadge: Record<string, { label: string; className: string }> = {
  live: { label: 'LIVE', className: 'bg-red-500 text-white' },
  ending_soon: { label: 'ENDING SOON', className: 'bg-orange-500 text-white' },
  scheduled: { label: 'SCHEDULED', className: 'bg-blue-600 text-white' },
  ended: { label: 'ENDED', className: 'bg-[var(--muted)] text-[var(--muted-foreground)]' },
  sold: { label: 'SOLD', className: 'bg-green-600 text-white' },
};

const currencySymbol = { USD: '$', EUR: '€', GBP: '£' };

export default function AuctionCard({ auction }: Props) {
  const { toggle, isWatched } = useWatchlist();
  const badge = statusBadge[auction.status];
  const sym = currencySymbol[auction.currency];
  const watched = isWatched(auction.id);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--muted)]">
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
        {/* Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-semibold tracking-widest px-2 py-1 rounded ${badge.className}`}>
          {badge.label}
        </span>
        {/* Watchlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(auction.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center hover:bg-white dark:hover:bg-black/80 transition-colors"
          aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <svg className={`w-4 h-4 ${watched ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-[var(--foreground)]'}`} viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[var(--card-foreground)] text-sm leading-snug mb-1 line-clamp-2">
          {auction.title}
        </h3>
        <p className="text-[var(--muted-foreground)] text-xs mb-3 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {auction.location}, {auction.country}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">
                {auction.status === 'scheduled' ? 'Starting bid' : 'Current bid'}
              </p>
              <p className="text-lg font-bold font-mono text-[var(--card-foreground)]">
                {auction.status === 'scheduled'
                  ? `${sym}${auction.startingBid.toLocaleString()}`
                  : `${sym}${auction.currentBid.toLocaleString()}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">
                {auction.status === 'scheduled' ? 'Starts in' : 'Ends in'}
              </p>
              <CountdownTimer endTime={auction.status === 'scheduled' ? auction.startTime : auction.endTime} compact />
            </div>
          </div>

          {auction.status !== 'scheduled' && (
            <p className="text-[11px] text-[var(--muted-foreground)] mb-3">
              {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'}
            </p>
          )}

          <Link
            to={`/auctions/${auction.id}`}
            className="block w-full text-center py-2 text-sm font-medium border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-[var(--radius)] transition-colors duration-150"
          >
            View Auction
          </Link>
        </div>
      </div>
    </div>
  );
}
