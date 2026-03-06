export default function Spinner({ size = 'md' }) {
  const sizes = { sm: '1.2rem', md: '2rem', lg: '3rem' };
  return (
    <div
      className="spinner"
      style={{ width: sizes[size], height: sizes[size] }}
      role="status"
      aria-label="Loading"
    />
  );
}
