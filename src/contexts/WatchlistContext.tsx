import { createContext, useContext, useState } from 'react';

interface WatchlistContextType {
  watchlist: string[];
  toggle: (id: string) => void;
  isWatched: (id: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  toggle: () => {},
  isWatched: () => false,
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('watchlist') || '[]');
    } catch {
      return [];
    }
  });

  const toggle = (id: string) => {
    setWatchlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('watchlist', JSON.stringify(next));
      return next;
    });
  };

  const isWatched = (id: string) => watchlist.includes(id);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
