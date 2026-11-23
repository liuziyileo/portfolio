import { Syne, Plus_Jakarta_Sans } from 'next/font/google';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Leo Liu | 3D, Compositing & Visual Arts',
  description: 'Portfolio of Leo Liu — 3D Work, Compositing & 2D, and Miscellaneous projects.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable}`}>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#F9F7F1',
          color: '#141413',
          fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        <footer
          style={{
            width: '100%',
            padding: '24px 36px',
            borderTop: '1px solid rgba(20, 20, 19, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            color: '#57554E',
            boxSizing: 'border-box',
          }}
        >
          <span>© Leo Liu 2026</span>
          <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            3D • Compositing • 2D
          </span>
        </footer>
      </body>
    </html>
  );
}