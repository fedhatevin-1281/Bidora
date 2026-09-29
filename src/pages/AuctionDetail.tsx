import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auctions, bids } from '../data/auctions';
import CountdownTimer from '../components/CountdownTimer';
import BidModal from '../components/BidModal';
import { useWatchlist } from '../contexts/WatchlistContext';

const sym = { USD: '$', EUR: '€', GBP: '£' };

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const auction = auctions.find(a => a.id === id);
  const [imgIdx, setImgIdx] = useState(0);
  const [bidModal, setBidModal] = useState(false);
  const [currentBid, setCurrentBid] = useState(auction?.currentBid ?? 0);
  const [bidCount, setBidCount] = useState(auction?.bidCount ?? 0);
  const { toggle, isWatched } = useWatchlist();

  if (!auction) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-[var(--foreground)] mb-3">Auction Not Found</h1>
        <p className="text-[var(--muted-foreground)] mb-6">This auction may have ended or the link is invalid.</p>
        <Link to="/auctions" className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] text-sm font-medium">Browse Auctions</Link>
      </div>
    );
  }

  const s = sym[auction.currency];
  const auctionBids = bids.filter(b => b.auctionId === auction.id);
  const isVehicle = ['cars', 'motorcycles', 'commercial_vehicles'].includes(auction.category);
  const isProperty = ['houses', 'commercial_buildings', 'land'].includes(auction.category);
  const watched = isWatched(auction.id);

  const handleBid = (amount: number) => {
    setCurrentBid(amount);
    setBidCount(c => c + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
        <Link to="/" className="hover:text-[var(--foreground)]">Home</Link>
        <span>/</span>
        <Link to="/auctions" className="hover:text-[var(--foreground)]">Auctions</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate">{auction.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="relative rounded-[var(--radius-lg)] overflow-hidden aspect-[16/10] bg-[var(--muted)] mb-3">
            <img
              src={auction.images[imgIdx]}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              {auction.status === 'live' && (
                <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            {auction.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() => setImgIdx(i => Math.min(auction.images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {auction.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {auction.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[var(--accent)]' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-2">{auction.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full font-medium">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Verified Listing
            </span>
            <span className="text-[var(--muted-foreground)] text-sm flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {auction.location}, {auction.country}
            </span>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 mb-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Current Bid</p>
                <p className="font-mono text-3xl font-bold text-[var(--foreground)]">{s}{currentBid.toLocaleString()}</p>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{bidCount} bids</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Ends in</p>
                <CountdownTimer endTime={auction.endTime} />
              </div>
            </div>

            <button
              onClick={() => setBidModal(true)}
              className="w-full py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity text-base mb-2"
            >
              Place Bid
            </button>
            <button
              onClick={() => toggle(auction.id)}
              className={`w-full py-2.5 border rounded-[var(--radius)] text-sm font-medium transition-colors ${
                watched
                  ? 'border-red-300 text-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {watched ? '♥ Watching' : '♡ Add to Watchlist'}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">{auction.description}</p>

          {/* Specs */}
          {isVehicle && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Vehicle Details</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  ['Year', auction.year],
                  ['Make', auction.make],
                  ['Model', auction.model],
                  ['Mileage', auction.mileage ? `${auction.mileage.toLocaleString()} mi` : '—'],
                  ['Fuel', auction.fuel],
                  ['Transmission', auction.transmission],
                  ['Engine', auction.engine],
                  ['Drivetrain', auction.drivetrain],
                  ['Condition', auction.condition],
                  ['Color', auction.color],
                  ['VIN', auction.vin],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={String(k)} className="border-b border-[var(--border)] pb-2">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-0.5">{k}</p>
                    <p className="text-sm text-[var(--foreground)] font-medium">{String(v)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isProperty && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Property Details</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  ['Type', auction.propertyType],
                  ['Building Size', auction.buildingSize ? `${auction.buildingSize.toLocaleString()} sq ft` : '—'],
                  ['Land Size', auction.landSize ? `${auction.landSize.toLocaleString()} sq ft` : '—'],
                  ['Bedrooms', auction.bedrooms],
                  ['Bathrooms', auction.bathrooms],
                  ['Parking', auction.parking ? `${auction.parking} spaces` : '—'],
                  ['Year Built', auction.yearBuilt],
                  ['Floors', auction.floors],
                  ['Zoning', auction.zoning],
                  ['Condition', auction.condition],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={String(k)} className="border-b border-[var(--border)] pb-2">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-0.5">{k}</p>
                    <p className="text-sm text-[var(--foreground)] font-medium">{String(v)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {auction.features && auction.features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {auction.features.map(f => (
                  <span key={f} className="px-2.5 py-1 bg-[var(--secondary)] text-[var(--foreground)] text-xs rounded-full border border-[var(--border)]">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bid History */}
      <div className="mt-10 max-w-lg">
        <h2 className="font-semibold text-[var(--foreground)] mb-4">Bid History</h2>
        {auctionBids.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No bids yet. Be the first to bid.</p>
        ) : (
          <div className="border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--secondary)]">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Bidder</th>
                  <th className="text-right px-4 py-2.5 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Amount</th>
                  <th className="text-right px-4 py-2.5 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Time</th>
                </tr>
              </thead>
              <tbody>
                {auctionBids.map((bid, i) => (
                  <tr key={bid.id} className={i % 2 === 0 ? 'bg-[var(--card)]' : 'bg-[var(--background)]'}>
                    <td className="px-4 py-3 text-[var(--foreground)]">{bid.bidderLabel}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-[var(--foreground)]">{s}{bid.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-[var(--muted-foreground)]">{timeAgo(bid.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t border-[var(--border)] px-4 py-3 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Current Bid</p>
            <p className="font-mono font-bold text-lg text-[var(--foreground)]">{s}{currentBid.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setBidModal(true)}
            className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity"
          >
            Place Bid
          </button>
        </div>
      </div>

      {bidModal && (
        <BidModal
          auction={{ ...auction, currentBid, bidCount }}
          onClose={() => setBidModal(false)}
          onBid={handleBid}
        />
      )}
    </div>
  );
}
