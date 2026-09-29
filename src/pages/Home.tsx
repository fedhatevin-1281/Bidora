import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auctions, categories } from '../data/auctions';
import AuctionCard from '../components/AuctionCard';
import CountdownTimer from '../components/CountdownTimer';

const sym = { USD: '$', EUR: '€', GBP: '£' };

function Hero() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    navigate(`/auctions?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop&auto=format"
          alt="Premium car auction"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-36">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl sm:text-7xl text-white leading-tight mb-4">
            Find. Bid. Win.
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
            Discover cars and properties available through trusted online auctions across the USA and Europe.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/auctions"
              className="px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity"
            >
              Browse Auctions
            </Link>
            <Link
              to="/sell"
              className="px-6 py-3 bg-white/10 border border-white/30 text-white font-medium rounded-[var(--radius)] hover:bg-white/20 transition-colors"
            >
              Sell an Asset
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-12 bg-[var(--background)]/95 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-3 font-medium">Search Auctions</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="Search cars, properties, locations..."
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="">All Categories</option>
              <option value="cars">Cars</option>
              <option value="motorcycles">Motorcycles</option>
              <option value="commercial_vehicles">Commercial Vehicles</option>
              <option value="houses">Houses</option>
              <option value="commercial_buildings">Commercial Buildings</option>
              <option value="land">Land</option>
            </select>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="">All Locations</option>
              <option value="USA">USA</option>
              <option value="UK">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Portugal">Portugal</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function LiveAuctions() {
  const live = auctions.filter(a => a.status === 'live' || a.status === 'ending_soon').slice(0, 4);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live Now
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)]">Live Auctions</h2>
        </div>
        <Link to="/auctions" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {live.map(a => <AuctionCard key={a.id} auction={a} />)}
      </div>
    </section>
  );
}

function EndingSoon() {
  const ending = auctions
    .filter(a => a.status === 'live' || a.status === 'ending_soon')
    .sort((a, b) => a.endTime.getTime() - b.endTime.getTime())
    .slice(0, 4);

  return (
    <section className="bg-[var(--secondary)] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] mb-6">Ending Soon</h2>
        <div className="flex flex-col gap-3">
          {ending.map(a => {
            const s = sym[a.currency];
            return (
              <Link
                key={a.id}
                to={`/auctions/${a.id}`}
                className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-3 sm:p-4 hover:shadow-sm transition-shadow"
              >
                <img
                  src={a.images[0]}
                  alt={a.title}
                  className="w-16 h-16 sm:w-20 sm:h-14 object-cover rounded-[var(--radius)] shrink-0 bg-[var(--muted)]"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--foreground)] truncate">{a.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{a.location}</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Current bid</p>
                  <p className="font-mono font-semibold text-sm text-[var(--foreground)]">{s}{a.currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Ends in</p>
                  <CountdownTimer endTime={a.endTime} compact />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)] mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/auctions?category=${cat.id}`}
            className="group relative rounded-[var(--radius-lg)] overflow-hidden aspect-square bg-[var(--muted)] hover:shadow-md transition-shadow"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 px-2 text-center">
              <p className="text-white font-semibold text-sm leading-tight">{cat.label}</p>
              <p className="text-white/60 text-xs mt-0.5">{cat.count} listings</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Browse', desc: 'Explore thousands of verified vehicles and properties from across the USA and Europe.' },
    { num: '02', title: 'Register', desc: 'Create a free account in minutes and complete your identity verification.' },
    { num: '03', title: 'Bid', desc: 'Place bids in real time with full transparency. Get outbid alerts instantly.' },
    { num: '04', title: 'Win', desc: 'Complete your payment securely and receive full ownership documentation.' },
  ];
  return (
    <section className="bg-[var(--secondary)] py-16" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)] mb-3">How It Works</h2>
          <p className="text-[var(--muted-foreground)] max-w-lg mx-auto">Simple, transparent, and secure. From browsing to winning in four steps.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
              <span className="font-mono text-4xl font-bold text-[var(--border)] block mb-4">{step.num}</span>
              <h3 className="font-semibold text-[var(--foreground)] text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SellSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1400&h=500&fit=crop&auto=format"
          alt="Sell your asset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative px-8 sm:px-12 py-14 sm:py-20 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">Have something to sell?</h2>
          <p className="text-white/75 mb-7 leading-relaxed">
            List your vehicle or property and reach thousands of verified buyers across the USA and Europe.
          </p>
          <Link
            to="/sell"
            className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity"
          >
            Sell With Us
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const features = [
    { icon: '✓', title: 'Verified Listings', desc: 'Every listing is reviewed by our verification team before going live.' },
    { icon: '🔒', title: 'Secure Bidding', desc: 'Industry-standard encryption protects every bid and transaction.' },
    { icon: '◎', title: 'Transparent Auctions', desc: 'Full bid history, no hidden fees. You see exactly what you\'re paying.' },
    { icon: '💳', title: 'Secure Payments', desc: 'Multiple trusted payment methods with escrow protection.' },
  ];
  return (
    <section className="bg-[var(--card)] border-y border-[var(--border)] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="text-center px-2">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <LiveAuctions />
      <EndingSoon />
      <Categories />
      <HowItWorks />
      <SellSection />
      <TrustSection />
    </>
  );
}
