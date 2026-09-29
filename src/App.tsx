import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import Watchlist from './pages/Watchlist';
import Sell from './pages/Sell';
import HowItWorks from './pages/HowItWorks';
import { AccountLayout, AccountOverview, AccountBids, AccountWon, AccountPayments, AccountProfile, AccountSettings } from './pages/Account';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuctions from './pages/admin/AdminAuctions';
import AdminCreateAuction from './pages/admin/AdminCreateAuction';
import { AdminBids, AdminUsers, AdminSellers, AdminDocuments, AdminPayments, AdminSettings } from './pages/admin/AdminOther';

export default function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/auctions" element={<Layout><Auctions /></Layout>} />
            <Route path="/auctions/:id" element={<Layout><AuctionDetail /></Layout>} />
            <Route path="/watchlist" element={<Layout><Watchlist /></Layout>} />
            <Route path="/sell" element={<Layout><Sell /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
            <Route path="/about" element={<Layout><HowItWorks /></Layout>} />

            {/* Account routes */}
            <Route path="/account" element={<Layout><AccountLayout /></Layout>}>
              <Route index element={<AccountOverview />} />
              <Route path="bids" element={<AccountBids />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="won" element={<AccountWon />} />
              <Route path="payments" element={<AccountPayments />} />
              <Route path="profile" element={<AccountProfile />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* Admin routes */}
            <Route path="/adminsite" element={<AdminLogin />} />
            <Route path="/adminsite/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="auctions" element={<AdminAuctions />} />
              <Route path="auctions/create" element={<AdminCreateAuction />} />
              <Route path="bids" element={<AdminBids />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route index element={<Navigate to="/adminsite/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Layout>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
                <h1 className="font-serif text-4xl text-[var(--foreground)] mb-3">Page Not Found</h1>
                <p className="text-[var(--muted-foreground)] mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] text-sm font-medium">Go Home</a>
              </div>
            </Layout>} />
          </Routes>
        </BrowserRouter>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
