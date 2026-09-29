import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VIDEO_PROVIDERS = ['Google Drive', 'YouTube', 'Vimeo', 'Direct URL'];
const CATEGORIES = ['Car', 'Motorcycle', 'Commercial Vehicle', 'House', 'Commercial Building', 'Land', 'Other'];
const STATUSES = ['Draft', 'Scheduled', 'Live', 'Paused', 'Ended', 'Sold', 'Unsold'];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block">{children}</label>;
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />;
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
      {children}
    </select>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 mb-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-4 pb-3 border-b border-[var(--border)]">{title}</h2>
      {children}
    </div>
  );
}

export default function AdminCreateAuction() {
  const [category, setCategory] = useState('Car');
  const [status, setStatus] = useState('Draft');
  const [videoProvider, setVideoProvider] = useState(VIDEO_PROVIDERS[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState(['', '', '']);
  const [hideAddress, setHideAddress] = useState(false);
  const [docs, setDocs] = useState([{ name: '', url: '', status: 'Pending' }]);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const isVehicle = ['Car', 'Motorcycle', 'Commercial Vehicle'].includes(category);
  const isProperty = ['House', 'Commercial Building', 'Land'].includes(category);

  const handlePublish = () => {
    navigate('/adminsite/auctions');
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)]">Create Auction</h1>
        {saved && <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/10 px-3 py-1 rounded-full">Draft saved</span>}
      </div>

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Label>Auction Title</Label><Input placeholder="e.g. 2022 BMW M4 Competition" /></div>
          <div className="sm:col-span-2"><Label>Description</Label>
            <textarea rows={3} className="w-full px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Seller</Label>
            <Input placeholder="Select or enter seller name" />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
          </div>
        </div>
      </Section>

      {/* Media */}
      <Section title="Media">
        <div className="mb-4">
          <Label>Main Image URL</Label>
          <Input placeholder="https://example.com/main.jpg" />
        </div>
        <div className="mb-4">
          <Label>Additional Images</Label>
          <div className="flex flex-col gap-2">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <Input value={img} onChange={e => setImages(imgs => imgs.map((x, j) => j === i ? e.target.value : x))} placeholder={`Image URL ${i + 2}`} />
                {i === images.length - 1 && (
                  <button onClick={() => setImages(imgs => [...imgs, ''])} className="px-3 text-[var(--accent)] text-sm font-medium whitespace-nowrap border border-[var(--border)] rounded-[var(--radius)]">+</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label>Video</Label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {VIDEO_PROVIDERS.map(p => (
              <button key={p} onClick={() => setVideoProvider(p)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${videoProvider === p ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder={videoProvider === 'Google Drive' ? 'https://drive.google.com/file/d/...' : 'Video URL'}
            />
            {videoUrl && (
              <button className="px-3 py-2 text-xs border border-[var(--border)] rounded-[var(--radius)] text-[var(--accent)] whitespace-nowrap">Preview</button>
            )}
          </div>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        <div className="grid grid-cols-2 gap-4">
          {['Country', 'State / Region', 'City', 'Postal Code'].map(f => (
            <div key={f}><Label>{f}</Label><Input /></div>
          ))}
          <div className="col-span-2"><Label>Address</Label><Input /></div>
          <div><Label>Latitude</Label><Input type="number" step="any" /></div>
          <div><Label>Longitude</Label><Input type="number" step="any" /></div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hideAddress} onChange={e => setHideAddress(e.target.checked)} className="accent-[var(--accent)]" />
              <span className="text-sm text-[var(--foreground)]">Hide exact address from public listing</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Auction Details */}
      <Section title="Auction Details">
        <div className="grid grid-cols-2 gap-4">
          {['Starting Price', 'Reserve Price', 'Min Bid Increment'].map(f => (
            <div key={f}><Label>{f}</Label><Input type="number" /></div>
          ))}
          <div><Label>Currency</Label>
            <Select><option>USD</option><option>EUR</option><option>GBP</option></Select>
          </div>
          <div><Label>Start Date</Label><Input type="date" /></div>
          <div><Label>Start Time</Label><Input type="time" /></div>
          <div><Label>End Date</Label><Input type="date" /></div>
          <div><Label>End Time</Label><Input type="time" /></div>
        </div>
      </Section>

      {/* Vehicle Details (conditional) */}
      {isVehicle && (
        <Section title="Vehicle Details">
          <div className="grid grid-cols-2 gap-4">
            {['Make', 'Model', 'Year', 'Mileage', 'Fuel Type', 'Transmission', 'Engine', 'Drivetrain', 'VIN', 'Condition', 'Color'].map(f => (
              <div key={f}><Label>{f}</Label><Input /></div>
            ))}
          </div>
        </Section>
      )}

      {/* Property Details (conditional) */}
      {isProperty && (
        <Section title="Property Details">
          <div className="grid grid-cols-2 gap-4">
            {['Property Type', 'Building Size (sq ft)', 'Land Size (sq ft)', 'Bedrooms', 'Bathrooms', 'Parking Spaces', 'Year Built', 'Floors', 'Zoning', 'Condition'].map(f => (
              <div key={f}><Label>{f}</Label><Input /></div>
            ))}
          </div>
        </Section>
      )}

      {/* Documents */}
      <Section title="Documents">
        <div className="flex flex-col gap-3 mb-3">
          {docs.map((doc, i) => (
            <div key={i} className="grid grid-cols-5 gap-2">
              <div className="col-span-2"><Input placeholder="Document name" value={doc.name} onChange={e => setDocs(d => d.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} /></div>
              <div className="col-span-2"><Input placeholder="Document URL" value={doc.url} onChange={e => setDocs(d => d.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} /></div>
              <Select value={doc.status} onChange={e => setDocs(d => d.map((x, j) => j === i ? { ...x, status: e.target.value } : x))}>
                <option>Pending</option><option>Verified</option><option>Rejected</option>
              </Select>
            </div>
          ))}
        </div>
        <button onClick={() => setDocs(d => [...d, { name: '', url: '', status: 'Pending' }])} className="text-sm text-[var(--accent)] font-medium">+ Add Document</button>
      </Section>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setSaved(true)} className="px-5 py-2.5 border border-[var(--border)] text-sm font-medium text-[var(--foreground)] rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors">
          Save Draft
        </button>
        <button className="px-5 py-2.5 border border-[var(--border)] text-sm font-medium text-[var(--foreground)] rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors">
          Preview
        </button>
        <button onClick={handlePublish} className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity">
          Publish Auction
        </button>
      </div>
    </div>
  );
}
