import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';

const display = Manrope({ variable: '--font-display', subsets: ['latin'] });
const body = DM_Sans({ variable: '--font-body', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://agentichire-ai.sampath6068.chatgpt.site'),
  title: 'AgenticHire — Structured hiring, human decisions',
  description: 'Public careers and a transparent, human-in-the-loop recruitment workspace.',
  openGraph: {
    title: 'AgenticHire',
    description: 'Structured hiring. Human decisions.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AgenticHire — Structured hiring. Human decisions.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgenticHire',
    description: 'Structured hiring. Human decisions.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
