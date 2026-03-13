import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DealsSlider({ deals }) {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  if (!deals.length) return null;

  function scroll(dir) {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  }

  function handleClick(deal) {
    if (!deal.link_url) return;
    if (deal.link_url.startsWith('http')) {
      window.open(deal.link_url, '_blank');
    } else {
      navigate(deal.link_url);
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <h2 className="text-xl font-bold text-slate-800">Deals & Offers</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition">
            ‹
          </button>
          <button onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition">
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => handleClick(deal)}
            className={`shrink-0 w-64 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm transition hover:shadow-md ${deal.link_url ? 'cursor-pointer' : ''}`}
          >
            {deal.image_url ? (
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                {deal.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}>
                    {deal.badge}
                  </span>
                )}
              </div>
            ) : (
              <div className="h-12 flex items-center px-3" style={{ backgroundColor: 'var(--color-primary)' }}>
                {deal.badge && (
                  <span className="px-2 py-0.5 bg-white rounded text-xs font-bold"
                    style={{ color: 'var(--color-primary)' }}>
                    {deal.badge}
                  </span>
                )}
              </div>
            )}
            <div className="p-3">
              <p className="font-semibold text-slate-800 text-sm leading-snug">{deal.title}</p>
              {deal.expires_at && (
                <p className="text-xs text-slate-400 mt-1">
                  Until {new Date(deal.expires_at).toLocaleDateString()}
                </p>
              )}
              {deal.link_url && (
                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-primary)' }}>
                  Shop now →
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
