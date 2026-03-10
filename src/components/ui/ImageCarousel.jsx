import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImageCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const go = useCallback(
    (idx) => setCurrent((idx + slides.length) % slides.length),
    [slides.length]
  );

  // Auto-play every 5s
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current, go, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  function handleBtn() {
    if (!slide.button_link) return;
    if (slide.button_link.startsWith('http')) {
      window.open(slide.button_link, '_blank');
    } else {
      navigate(slide.button_link);
    }
  }

  return (
    <div className="relative overflow-hidden" style={{ height: 'clamp(220px, 45vw, 520px)' }}>

      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          <img src={s.image_url} alt={s.title || ''} className="w-full h-full object-cover" />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Text content */}
      {(slide.title || slide.subtitle || slide.button_text) && (
        <div className="absolute inset-0 flex items-center px-8 md:px-16 z-10">
          <div className="max-w-lg">
            {slide.title && (
              <h2 className="text-white font-bold text-2xl md:text-4xl drop-shadow mb-2 leading-tight">
                {slide.title}
              </h2>
            )}
            {slide.subtitle && (
              <p className="text-white/85 text-sm md:text-lg mb-4 drop-shadow">
                {slide.subtitle}
              </p>
            )}
            {slide.button_text && (
              <button onClick={handleBtn} className="btn-primary px-6 py-2.5 text-sm md:text-base">
                {slide.button_text}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
            aria-label="Previous"
          >‹</button>
          <button
            onClick={() => go(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
            aria-label="Next"
          >›</button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
