import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/** Returns max nesting depth of a category tree. */
function getMaxDepth(cats) {
  if (!cats?.length) return 0;
  return 1 + Math.max(0, ...cats.map((c) => getMaxDepth(c.children || [])));
}

export default function CategoryBrowser({ categories }) {
  // ── Guard ──────────────────────────────────────────────────────────────────
  if (!categories?.length) return null;

  const maxDepth = getMaxDepth(categories);

  // ── Depth 1: simple grid (no state needed) ─────────────────────────────────
  if (maxDepth === 1) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        <Link to="/products" className="group flex flex-col items-center gap-2">
          <div
            className="w-full aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl border-2 transition-all"
            style={{ borderColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            🛍️
          </div>
          <span className="text-xs font-semibold text-slate-600 text-center">All</span>
        </Link>

        {categories.map((cat) => (
          <Link key={cat.id} to={`/products?category_id=${cat.id}`} className="group flex flex-col items-center gap-2">
            <div
              className="w-full aspect-square rounded-xl overflow-hidden border-2 transition-all"
              style={{ borderColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
            >
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-2xl">🏷️</div>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-600 text-center leading-tight px-1">{cat.name}</span>
          </Link>
        ))}
      </div>
    );
  }

  // ── Depth 2 / 3: stateful tabbed layout ───────────────────────────────────
  return <TabbedBrowser categories={categories} maxDepth={maxDepth} />;
}

// Separate component so hooks are always called (no conditional hooks issue)
function TabbedBrowser({ categories, maxDepth }) {
  const [activeL1Id, setActiveL1Id] = useState(categories[0]?.id ?? null);
  const [activeL2Id, setActiveL2Id] = useState(categories[0]?.children?.[0]?.id ?? null);

  // When L1 changes → auto-select first L2
  useEffect(() => {
    const l1 = categories.find((c) => c.id === activeL1Id);
    setActiveL2Id(l1?.children?.[0]?.id ?? null);
  }, [activeL1Id]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedL1  = categories.find((c) => c.id === activeL1Id) ?? categories[0];
  const l2Cats      = selectedL1?.children ?? [];
  const selectedL2  = l2Cats.find((c) => c.id === activeL2Id) ?? l2Cats[0] ?? null;
  const l3Cats      = selectedL2?.children ?? [];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

      {/* ── L1 Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto" style={{ background: '#eef2f7', borderBottom: '1px solid #e2e8f0' }}>
        {categories.map((cat, i) => {
          const active = cat.id === activeL1Id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveL1Id(cat.id)}
              style={{
                flexShrink: 0,
                padding: '12px 20px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                outline: 'none',
                border: 'none',
                borderLeft: i > 0 ? '1px solid #d1d9e6' : 'none',
                borderBottom: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: active ? 'var(--color-primary)' : '#64748b',
                background: active ? '#ffffff' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ── L2 Circular Cards ───────────────────────────────────────────────── */}
      {l2Cats.length > 0 && (
        <div style={{ padding: '16px 20px', borderBottom: l3Cats.length > 0 ? '1px solid #f1f5f9' : 'none', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '20px', minWidth: 'max-content' }}>
            {l2Cats.map((l2) => {
              const active = l2.id === (selectedL2?.id);
              return (
                <button
                  key={l2.id}
                  type="button"
                  onClick={() => setActiveL2Id(l2.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: '0 4px 4px',
                    flexShrink: 0,
                  }}
                >
                  {/* Circle */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: active ? '2.5px solid var(--color-primary)' : '2.5px solid #e2e8f0',
                      boxShadow: active ? '0 0 0 3px rgba(var(--color-primary-rgb),0.15)' : 'none',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    {l2.image_url ? (
                      <img src={l2.image_url} alt={l2.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏷️</div>
                    )}
                  </div>

                  {/* Name */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textAlign: 'center',
                      maxWidth: 80,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: active ? 'var(--color-primary)' : '#475569',
                      transition: 'color 0.15s',
                    }}
                  >
                    {l2.name}
                  </span>

                  {/* Active underline */}
                  <div
                    style={{
                      height: 2,
                      width: '100%',
                      borderRadius: 9999,
                      background: active ? 'var(--color-primary)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── L3 Items (depth ≥ 3, when L2 selected) ──────────────────────────── */}
      {maxDepth >= 3 && selectedL2 && (
        <div style={{ padding: '16px 20px', minHeight: 64 }}>
          {l3Cats.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '2px 12px',
              }}
            >
              {l3Cats.map((l3) => (
                <Link
                  key={l3.id}
                  to={`/products?category_id=${l3.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 6px',
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#475569',
                    textDecoration: 'none',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-primary)', opacity: 0.5, flexShrink: 0 }} />
                  {l3.name}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              to={`/products?category_id=${selectedL2.id}`}
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Shop all {selectedL2.name} →
            </Link>
          )}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '10px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          {l2Cats.length > 0
            ? <>{l2Cats.length} sub-categor{l2Cats.length === 1 ? 'y' : 'ies'} in <strong style={{ color: '#64748b' }}>{selectedL1?.name}</strong></>
            : <>Browsing <strong style={{ color: '#64748b' }}>{selectedL1?.name}</strong></>
          }
        </span>
        {selectedL1 && (
          <Link
            to={`/products?category_id=${selectedL1.id}`}
            style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', textDecoration: 'none', flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            View All →
          </Link>
        )}
      </div>
    </div>
  );
}
