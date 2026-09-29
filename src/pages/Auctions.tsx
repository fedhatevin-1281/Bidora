import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auctions } from '../data/auctions';
import AuctionCard from '../components/AuctionCard';

type SortKey = 'ending_soon' | 'newest' | 'most_bids' | 'price_asc' | 'price_desc';

export default function Auctions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('ending_soon');

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const status = searchParams.get('status') || '';

  const filtered = useMemo(() => {
    let list = [...auctions];
    if (q) list = list.filter(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.location.toLowerCase().includes(q.toLowerCase()));
    if (category) list = list.filter(a => a.category === category);
    if (location) list = list.filter(a => a.country.toLowerCase().includes(location.toLowerCase()));
    if (status) list = list.filter(a => a.status === status);

    switch (sort) {
      case 'ending_soon': return list.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
      case 'newest': return list.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
      case 'most_bids': return list.sort((a, b) => b.bidCount - a.bidCount);
      case 'price_asc': return list.sort((a, b) => a.currentBid - b.currentBid);
      case 'price_desc': return list.sort((a, b) => b.currentBid - a.currentBid);
      default: return list;
    }
  }, [q, category, location, status, sort]);

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)] mb-2">All Auctions</h1>
        <p className="text-[var(--muted-foreground)] text-sm">{filtered.length} auction{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search + Filters */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            defaultValue={q}
            onChange={e => setParam('q', e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Search auctions..."
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="ending_soon">Ending Soon</option>
            <option value="newest">Newest</option>
            <option value="most_bids">Most Bids</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'category', label: 'Category', options: [['', 'All Categories'], ['cars', 'Cars'], ['motorcycles', 'Motorcycles'], ['commercial_vehicles', 'Commercial Vehicles'], ['houses', 'Houses'], ['commercial_buildings', 'Commercial Buildings'], ['land', 'Land']] },
            { key: 'location', label: 'Location', options: [['', 'All Locations'], ['USA', 'USA'], ['UK', 'UK'], ['Germany', 'Germany'], ['France', 'France'], ['Netherlands', 'Netherlands'], ['Portugal', 'Portugal']] },
            { key: 'status', label: 'Status', options: [['', 'All Status'], ['live', 'Live'], ['ending_soon', 'Ending Soon'], ['scheduled', 'Scheduled'], ['ended', 'Ended'], ['sold', 'Sold']] },
          ].map(f => (
            <select
              key={f.key}
              value={searchParams.get(f.key) || ''}
              onChange={e => setParam(f.key, e.target.value)}
              className="px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[var(--muted-foreground)] text-lg mb-2">No auctions found</p>
          <p className="text-sm text-[var(--muted-foreground)]">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(a => <AuctionCard key={a.id} auction={a} />)}
        </div>
      )}
    </div>
  );
}
