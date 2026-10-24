import './globals.css';
export const metadata = {
  title: { default: 'FORME — Independent digital studio', template: '%s | FORME' },
  description: 'A digital studio concept bringing strategy, identity, and engineering together. Explore our approach and shape your next project.',
  icons: { icon: '/favicon.svg' }
};
export const viewport = { themeColor: '#e9e6df' };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
