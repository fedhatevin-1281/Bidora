import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@auctionhub.com' && password === 'admin') {
      navigate('/adminsite/dashboard');
    } else {
      setError('Invalid credentials. Use admin@auctionhub.com / admin');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg font-serif">A</span>
          </div>
          <h1 className="font-serif text-2xl text-[var(--foreground)] mb-1">Admin Access</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Restricted area — authorised personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-[var(--radius)] text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="admin@auctionhub.com"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-[var(--radius)] hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
          <p className="text-xs text-center text-[var(--muted-foreground)] mt-4">Demo: admin@auctionhub.com / admin</p>
        </form>
      </div>
    </div>
  );
}
