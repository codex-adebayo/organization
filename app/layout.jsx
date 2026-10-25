import './globals.css';
export const metadata = {
  title: { default: 'FORME — Data automation agency', template: '%s | FORME' },
  description: 'Connect your tools, automate repeatable workflows, and turn scattered data into useful decisions. Explore FORME’s data automation approach and create an automation brief.',
  icons: { icon: '/favicon.svg' }
};
export const viewport = { themeColor: '#e9e6df' };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
