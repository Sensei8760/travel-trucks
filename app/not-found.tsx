import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '64px', marginBottom: '16px' }}>404</h1>
        <p style={{ fontSize: '18px', marginBottom: '24px' }}>
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href="/"
          style={{
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#111',
            padding: '12px 24px',
            borderRadius: '8px',
            display: 'inline-block',
          }}
        >
          Go back home
        </Link>
      </div>
    </section>
  );
}
