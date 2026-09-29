import { useState } from 'react';

interface Props {
  auction: {
    title: string;
    currentBid: number;
    currency: 'USD' | 'EUR' | 'GBP';
    bidCount: number;
  };
  onClose: () => void;
  onBid: (amount: number) => void;
}

const sym = { USD: '$', EUR: '€', GBP: '£' };

export default function BidModal({ auction, onClose, onBid }: Props) {
  const minBid = auction.currentBid + 500;
  const [amount, setAmount] = useState(minBid);
  const [submitted, setSubmitted] = useState(false);
  const s = sym[auction.currency];

  const presets = [minBid, minBid + 500, minBid + 1500];

  const handleSubmit = () => {
    if (amount < minBid) return;
    setSubmitted(true);
    onBid(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[var(--background)] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Bid Placed Successfully</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-6">Your bid of {s}{amount.toLocaleString()} has been placed.</p>
            <button onClick={onClose} className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Place Your Bid</h3>
              <button onClick={onClose} className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-[var(--secondary)] rounded-[var(--radius)] p-4 mb-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--muted-foreground)]">Current bid</span>
                <span className="font-mono font-semibold text-[var(--foreground)]">{s}{auction.currentBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Minimum bid</span>
                <span className="font-mono font-semibold text-[var(--accent)]">{s}{minBid.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`flex-1 py-2 text-sm font-mono rounded-[var(--radius)] border transition-colors ${
                    amount === p
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                      : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]'
                  }`}
                >
                  {s}{p.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">Bid amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-mono">{s}</span>
                <input
                  type="number"
                  value={amount}
                  min={minBid}
                  step={500}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] font-mono text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
              {amount < minBid && (
                <p className="text-red-500 text-xs mt-1">Bid must be at least {s}{minBid.toLocaleString()}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={amount < minBid}
              className="w-full py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Place Bid — {s}{amount.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
