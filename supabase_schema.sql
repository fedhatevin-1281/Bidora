-- Run this SQL in the Supabase SQL Editor

-- 1. Create a custom enum type for auction status
CREATE TYPE auction_status AS ENUM ('active', 'ended', 'cancelled');

-- 2. Create Auctions Table
CREATE TABLE public.auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    starting_price DECIMAL(10, 2) NOT NULL,
    current_bid DECIMAL(10, 2) DEFAULT 0.00,
    end_time TIMESTAMPTZ NOT NULL,
    seller_id UUID REFERENCES auth.users(id) NOT NULL,
    status auction_status DEFAULT 'active',
    image_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Bids Table
CREATE TABLE public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Watchlist Table
CREATE TABLE public.watchlist (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, auction_id)
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Auctions: Anyone can view, only authenticated users can create
CREATE POLICY "Auctions are viewable by everyone" ON public.auctions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create auctions" ON public.auctions FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their auctions" ON public.auctions FOR UPDATE TO authenticated USING (auth.uid() = seller_id);

-- Bids: Anyone can view, only authenticated users can insert
CREATE POLICY "Bids are viewable by everyone" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert bids" ON public.bids FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Watchlist: Users can only see and manage their own watchlist
CREATE POLICY "Users can manage their own watchlist" ON public.watchlist FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Create Auction Registrations Table (for 3% participation fee)
CREATE TABLE public.auction_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    fee_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending', -- 'pending' or 'completed'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(auction_id, user_id)
);

-- 7. RLS Policies for Auction Registrations
ALTER TABLE public.auction_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" ON public.auction_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own registrations" ON public.auction_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending registrations" ON public.auction_registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id AND payment_status = 'pending');
