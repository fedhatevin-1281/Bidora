import { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
  { id: 'commercial', label: 'Commercial Vehicle', icon: '🚛' },
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'commercial_building', label: 'Commercial Building', icon: '🏢' },
  { id: 'land', label: 'Land', icon: '🌿' },
  { id: 'other', label: 'Other', icon: '📦' },
];

const VIDEO_PROVIDERS = ['Google Drive', 'YouTube', 'Vimeo', 'Direct URL'];

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
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState(['']);
  const [videoProvider, setVideoProvider] = useState(VIDEO_PROVIDERS[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [hideAddress, setHideAddress] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!started) {
    return (
      <div>
        {/* Hero */}
        <section className="relative py-24">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&h=600&fit=crop&auto=format"
              alt="Sell"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Sell Your Vehicle or Property</h1>
            <p className="text-white/75 max-w-xl mx-auto mb-8">
              List your asset and reach thousands of verified buyers across the USA and Europe.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity text-base"
            >
              Start Selling
            </button>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] text-center mb-10">How Selling Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { num: 1, title: 'Submit listing', desc: 'Provide details, photos and documents for your asset.' },
              { num: 2, title: 'Verification', desc: 'Our team reviews and verifies your listing within 24–48 hours.' },
              { num: 3, title: 'Auction goes live', desc: 'Once approved, your auction is visible to all registered buyers.' },
              { num: 4, title: 'Buyers bid', desc: 'Buyers place competitive bids in real time.' },
              { num: 5, title: 'Complete the sale', desc: 'Accept the winning bid and complete the sale securely.' },
            ].map((step, i) => (
              <div key={i} className="text-center px-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">{step.num}</div>
                <h3 className="font-semibold text-sm text-[var(--foreground)] mb-1.5">{step.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-[var(--foreground)] mb-3">Listing Submitted</h2>
        <p className="text-[var(--muted-foreground)] mb-8">Your listing has been submitted for review. Our team will contact you within 24–48 hours.</p>
        <Link to="/" className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-[var(--radius)]">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-[var(--foreground)] mb-2">Create Listing</h1>
      <p className="text-[var(--muted-foreground)] text-sm mb-6">Step {step} of 9</p>
      <StepIndicator current={step} total={9} />

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">

        {step === 1 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Choose a Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-4 rounded-[var(--radius)] border-2 text-left transition-colors ${
                    category === c.id ? 'border-[var(--accent)] bg-orange-50 dark:bg-orange-900/10' : 'border-[var(--border)] hover:border-[var(--foreground)]'
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
              <div><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Title</label>
                <input className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" placeholder="e.g. 2022 BMW M4 Competition" /></div>
              <div><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Description</label>
                <textarea rows={4} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none" /></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Images & Video</h2>
            <div className="flex flex-col gap-3 mb-5">
              <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Image URLs</label>
              {images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={img}
                    onChange={e => setImages(imgs => imgs.map((x, j) => j === i ? e.target.value : x))}
                    className="flex-1 px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="https://example.com/image.jpg"
                  />
                  {images.length > 1 && (
                    <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="px-3 text-[var(--muted-foreground)] hover:text-red-500">×</button>
                  )}
                </div>
              ))}
              <button onClick={() => setImages(imgs => [...imgs, ''])} className="text-sm text-[var(--accent)] font-medium self-start">+ Add Image</button>
            </div>
            <div className="border-t border-[var(--border)] pt-4">
              <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-3 block">Video</label>
              <div className="flex gap-2 mb-2">
                {VIDEO_PROVIDERS.map(p => (
                  <button key={p} onClick={() => setVideoProvider(p)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${videoProvider === p ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <input
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder={videoProvider === 'Google Drive' ? 'https://drive.google.com/file/d/...' : 'Video URL'}
              />
              {videoUrl && <button className="mt-2 text-xs text-[var(--accent)]">Preview Video</button>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Country', 'State / Region', 'City', 'Postal Code', 'Address'].map(f => (
                <div key={f} className={f === 'Address' ? 'col-span-2' : ''}>
                  <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{f}</label>
                  <input className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" checked={hideAddress} onChange={e => setHideAddress(e.target.checked)} className="accent-[var(--accent)]" />
              <span className="text-sm text-[var(--foreground)]">Hide exact address from public listing</span>
            </label>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Asset Details</h2>
            {(category === 'car' || category === 'motorcycle' || category === 'commercial') && (
              <div className="grid grid-cols-2 gap-4">
                {['Make', 'Model', 'Year', 'Mileage', 'Fuel', 'Transmission', 'Engine', 'VIN', 'Color', 'Condition'].map(f => (
                  <div key={f}><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{f}</label>
                    <input className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
                ))}
              </div>
            )}
            {(category === 'house' || category === 'commercial_building' || category === 'land') && (
              <div className="grid grid-cols-2 gap-4">
                {['Property Type', 'Building Size (sq ft)', 'Land Size (sq ft)', 'Bedrooms', 'Bathrooms', 'Parking Spaces', 'Year Built', 'Floors', 'Zoning', 'Condition'].map(f => (
                  <div key={f}><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{f}</label>
                    <input className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
                ))}
              </div>
            )}
            {category === 'other' && (
              <div><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Asset Description</label>
                <textarea rows={4} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none" /></div>
            )}
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Auction Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Starting Price', 'Reserve Price', 'Min Bid Increment'].map(f => (
                <div key={f}><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{f}</label>
                  <input type="number" className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
              ))}
              <div><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Currency</label>
                <select className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
                  <option>USD</option><option>EUR</option><option>GBP</option>
                </select>
              </div>
              <div><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">Start Date</label>
                <input type="date" className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
              <div><label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">End Date</label>
                <input type="date" className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Documents</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">Upload supporting documents (service history, title, inspection reports).</p>
            <div className="flex flex-col gap-3">
              {['Title / Ownership Document', 'Inspection Report', 'Service History'].map(doc => (
                <div key={doc} className="flex items-center gap-3 p-3 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)]">
                  <svg className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-sm text-[var(--foreground)] flex-1">{doc}</span>
                  <input className="flex-1 text-xs text-[var(--muted-foreground)] bg-transparent focus:outline-none" placeholder="Paste document URL..." />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div>
            <h2 className="font-semibold text-[var(--foreground)] text-lg mb-5">Review Your Listing</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Category</span>
                <span className="text-[var(--foreground)] font-medium capitalize">{category || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Images</span>
                <span className="text-[var(--foreground)] font-medium">{images.filter(Boolean).length} added</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Video</span>
                <span className="text-[var(--foreground)] font-medium">{videoUrl ? videoProvider : 'None'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--muted-foreground)]">Address visibility</span>
                <span className="text-[var(--foreground)] font-medium">{hideAddress ? 'Hidden' : 'Visible'}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[var(--secondary)] rounded-[var(--radius)] text-xs text-[var(--muted-foreground)]">
              By submitting, you agree to our Terms of Service and Auction Rules.
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="text-center py-4">
            <p className="text-[var(--muted-foreground)] mb-6">Ready to submit your listing for review?</p>
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity"
            >
              Submit Listing
            </button>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-5 border-t border-[var(--border)]">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-5 py-2 text-sm border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--secondary)] transition-colors"
          >
            Back
          </button>
          {step < 9 && (
            <button
              onClick={() => setStep(s => Math.min(9, s + 1))}
              className="px-5 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
