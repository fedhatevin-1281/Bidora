import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  auctionId: string;
  startingBid: number;
}

export default function RegistrationModal({ isOpen, onClose, onSuccess, auctionId, startingBid }: RegistrationModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // 3% of the starting bid
  const feeAmount = startingBid * 0.03;
  // Paystack expects amount in the lowest currency denominator (e.g., cents/kobo)
  const paystackAmount = Math.round(feeAmount * 100);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || '',
    amount: paystackAmount, 
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    text: 'Pay Registration Fee',
  };

  const initializePayment = usePaystackPayment(config);

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    initializePayment({
      onSuccess: async (reference: any) => {
        try {
          // Insert into Supabase
          const { error } = await supabase.from('auction_registrations').insert({
            auction_id: auctionId,
            user_id: user?.id,
            fee_amount: feeAmount,
            payment_status: 'completed'
          });
          
          if (error) {
            console.error('Error saving registration:', error);
            alert('Payment succeeded but registration failed to save. Please contact support.');
          } else {
            onSuccess();
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          onClose();
        }
      },
      onClose: () => {
        setLoading(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
        <h2 className="text-xl font-serif text-gray-900 mb-4">Registration Required</h2>
        <p className="text-gray-600 mb-6">
          To bid on this item, you must pay a 3% registration fee based on the starting bid of ${startingBid.toLocaleString()}.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between font-medium">
            <span className="text-gray-700">Registration Fee (3%)</span>
            <span className="text-gray-900">${feeAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handlePay}
            disabled={loading}
            className="flex-1 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Paystack'}
          </button>
        </div>
      </div>
    </div>
  );
}
