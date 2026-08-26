import './globals.css';
export const metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), title: { default: 'AgenticHire AI', template: '%s | AgenticHire AI' }, description: 'Discover open roles and manage explainable, spec-driven AI recruitment workflows.', openGraph: { type: 'website', siteName: 'AgenticHire AI' } };
export default function RootLayout({ children }) { return <html lang="en"><body>{children}</body></html>; }
