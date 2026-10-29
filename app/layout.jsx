import './globals.css';
import './portfolio.css';

export const metadata = {
  title: { default: 'FORME — Automation, web design & cybersecurity', template: '%s | FORME' },
  description: 'FORME is an independent digital practice for automation, web design, and cybersecurity. Explore our services, concept work, and delivery approach.',
  icons: { icon: '/favicon.svg' }
};
export const viewport = { themeColor: '#111512' };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}