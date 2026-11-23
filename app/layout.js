import './globals.css';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata = {
  title: 'Leo Liu | 3D, Compositing & Visual Arts',
  description: 'Portfolio of Leo Liu — 3D Work, Compositing & 2D, and Miscellaneous projects.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        <footer className="portfolio-footer">
          <span className="footer-copy">© Leo Liu 2026 · 3D, compositing & visual arts</span>
          <div className="sticker-slot" aria-label="Reserved spot for a custom sticker">
            <span aria-hidden="true">✳</span>
            <small>your sticker</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
