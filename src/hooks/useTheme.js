// Theme presets
const PRESETS = {
  blue:   { primary: '#2563eb', dark: '#1d4ed8', accent: '#3b82f6' },
  green:  { primary: '#16a34a', dark: '#15803d', accent: '#22c55e' },
  purple: { primary: '#7c3aed', dark: '#6d28d9', accent: '#8b5cf6' },
  red:    { primary: '#dc2626', dark: '#b91c1c', accent: '#ef4444' },
  orange: { primary: '#ea580c', dark: '#c2410c', accent: '#f97316' },
  teal:   { primary: '#0d9488', dark: '#0f766e', accent: '#14b8a6' },
  pink:   { primary: '#db2777', dark: '#be185d', accent: '#ec4899' },
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '37, 99, 235';
}

export function applyTheme(themeSettings) {
  const preset = PRESETS[themeSettings?.preset] || PRESETS.blue;

  const primary = themeSettings?.primaryColor || preset.primary;
  const dark    = themeSettings?.darkColor    || preset.dark;
  const accent  = themeSettings?.accentColor  || preset.accent;
  const font    = themeSettings?.fontFamily   || 'Inter, system-ui, sans-serif';

  const root = document.documentElement;
  root.style.setProperty('--color-primary',      primary);
  root.style.setProperty('--color-primary-dark',  dark);
  root.style.setProperty('--color-accent',        accent);
  root.style.setProperty('--color-primary-rgb',   hexToRgb(primary));
  root.style.setProperty('--font-family',         font);
}

export { PRESETS };
