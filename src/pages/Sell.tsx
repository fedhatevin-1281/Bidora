import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const CATEGORIES = [
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
  { id: 'commercial', label: 'Commercial Vehicle', icon: '🚛' },
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'commercial_building', label: 'Commercial Building', icon: '🏢' },
  { id: 'land', label: 'Land', icon: '🌿' },
  { id: 'other', label: 'Other', icon: '📦' },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
            i + 1 < current ? 'bg-green-500 text-white' : i + 1 === current ? 'bg-[var(--accent)] text-white' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
          }`}>
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && <div className={`h-0.5 w-8 ${i + 1 < current ? 'bg-green-500' : 'bg-[var(--border)]'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Sell() {
  const { user } = useAuth();
  const [authModal, setAuthModal] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    images: [''],
    country: '',
    state: '',
    city: '',
    postalCode: '',
    address: '',
    hideAddress: false,
    startingPrice: '',
    reservePrice: '',
    minBidIncrement: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
    // Spec fields
    make: '', model: '', year: '', mileage: '', fuel: '', transmission: '', engine: '', vin: '', color: '', condition: '',
    propertyType: '', buildingSize: '', landSize: '', bedrooms: '', bathrooms: '', parkingSpaces: '', yearBuilt: '', floors: '', zoning: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleStart = () => {
    if (!user) {
      setAuthModal(true);
    } else {
      setStarted(true);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthModal(true);
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.from('auctions').insert({
        title: formData.title,
        description: formData.description,
        starting_price: parseFloat(formData.startingPrice) || 0,
        end_time: formData.endDate ? new Date(formData.endDate).toISOString() : new Date().toISOString(),
        seller_id: user.id,
        image_urls: formData.images.filter(img => img.trim() !== ''),
        status: 'active'
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (error: any) {
      console.error(error);
      alert('Error submitting auction: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!started) {
    return (
      <div>
        <section className="relative py-24">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&h=600&fit=crop&auto=format" alt="Sell" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Sell Your Vehicle or Property</h1>
            <p className="text-white/75 max-w-xl mx-auto mb-8">List your asset and reach thousands of verified buyers across the USA and Europe.</p>
            <button onClick={handleStart} className="px-8 py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity text-base">
              Start Selling
            </button>
          </div>
        </section>
        <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="font-serif text-3xl text-[var(--foreground)] mb-3">Listing Submitted</h2>
        <p className="text-[var(--muted-foreground)] mb-8">Your auction has been created successfully!</p>
        <Link to="/auctions" className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-[var(--radius)]">View Auctions</Link>
      </div>
    );
  }

  const isVehicle = ['car', 'motorcycle', 'commercial'].includes(formData.category);
  const isProperty = ['house', 'commercial_building', 'land'].includes(formData.category);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-[var(--foreground)] mb-2">Create Listing</h1>
      <p className="text-[var(--muted-foreground)] text-sm mb-6">Step {step} of 6</p>
      <StepIndicator current={step} total={6} />

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        {step === 1 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Choose a Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setFormData(p => ({ ...p, category: c.id }))}
                  className={`p-4 rounded-[var(--radius)] border-2 text-left transition-colors ${
                    formData.category === c.id ? 'border-[var(--accent)] bg-orange-50 dark:bg-orange-900/10' : 'border-[var(--border)] hover:border-[var(--foreground)]'
                  }`}
                >
                  <span className="text-2xl block mb-2">{c.icon}</span>
                  <span className="text-sm font-medium text-[var(--foreground)]">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Basic Information</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" placeholder="e.g. 2022 BMW M4 Competition" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Images</h2>
            <div className="flex flex-col gap-3 mb-5">
              <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Image URLs (comma separated for now)</label>
              {formData.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={img}
                    onChange={e => setFormData(p => ({ ...p, images: p.images.map((x, j) => j === i ? e.target.value : x) }))}
                    className="flex-1 px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="px-3 text-[var(--muted-foreground)] hover:text-red-500">×</button>
                  )}
                </div>
              ))}
              <button onClick={() => setFormData(p => ({ ...p, images: [...p.images, ''] }))} className="text-sm text-[var(--accent)] font-medium self-start">+ Add Image URL</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Asset Details</h2>
            {isVehicle && (
              <div className="grid grid-cols-2 gap-4">
                {['make', 'model', 'year', 'mileage', 'fuel', 'transmission', 'engine', 'vin', 'color', 'condition'].map(f => (
                  <div key={f}><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{f}</label>
                    <input name={f} value={(formData as any)[f]} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
                ))}
              </div>
            )}
            {isProperty && (
              <div className="grid grid-cols-2 gap-4">
                {['propertyType', 'buildingSize', 'landSize', 'bedrooms', 'bathrooms', 'parkingSpaces', 'yearBuilt', 'floors', 'zoning', 'condition'].map(f => (
                  <div key={f}><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{f}</label>
                    <input name={f} value={(formData as any)[f]} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Auction Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Starting Price</label>
                <input name="startingPrice" type="number" value={formData.startingPrice} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">End Date & Time</label>
                <input name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Review Your Listing</h2>
            <div className="space-y-3 text-sm mb-8">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Title</span>
                <span className="text-[var(--foreground)] font-medium">{formData.title || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Starting Price</span>
                <span className="text-[var(--foreground)] font-medium">${formData.startingPrice || '0'}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Listing'}
            </button>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-5 border-t border-[var(--border)]">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-5 py-2 text-sm border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--secondary)] transition-colors">
            Back
          </button>
          {step < 6 && (
            <button onClick={() => setStep(s => Math.min(6, s + 1))} className="px-5 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] hover:opacity-90 transition-opacity">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
