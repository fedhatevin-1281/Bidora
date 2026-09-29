import { useEffect, useState } from 'react';

interface Props {
  endTime: Date;
  compact?: boolean;
}

function getTimeLeft(endTime: Date) {
  const diff = endTime.getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, diff };
}

export default function CountdownTimer({ endTime, compact = false }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endTime));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  if (!timeLeft) return <span className="text-[var(--muted-foreground)] text-sm">Ended</span>;

  const isUrgent = timeLeft.diff < 3600000;

  if (compact) {
    const parts = timeLeft.h > 0
      ? `${timeLeft.h}h ${timeLeft.m}m`
      : `${timeLeft.m}m ${timeLeft.s}s`;
    return (
      <span className={`font-mono text-sm font-medium ${isUrgent ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
        {parts}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1 font-mono font-medium ${isUrgent ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
      <span className="text-2xl tabular-nums">{String(timeLeft.h).padStart(2, '0')}</span>
      <span className="text-[var(--muted-foreground)] text-xl">:</span>
      <span className="text-2xl tabular-nums">{String(timeLeft.m).padStart(2, '0')}</span>
      <span className="text-[var(--muted-foreground)] text-xl">:</span>
      <span className="text-2xl tabular-nums">{String(timeLeft.s).padStart(2, '0')}</span>
    </div>
  );
}
