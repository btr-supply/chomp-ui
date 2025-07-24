import type { Metadata, Viewport } from 'next';
import { Inter, Modak, IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { NotificationStack } from '@components/NotificationStack';
import { PageLoader } from '@components/Loader';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const modak = Modak({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-modak'
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-mono'
});

const texGyreMath = localFont({
  src: '../public/fonts/TeXGyreTermesX-Regular.woff2',
  display: 'swap',
  variable: '--font-tex-gyre-math'
});

export const metadata: Metadata = {
  title: 'Chomp - Data Ingestion Platform',
  description: 'Low-code, real-time data aggregation and analysis platform',
  keywords: ['data', 'analytics', 'API', 'real-time', 'ingestion'],
  authors: [{ name: 'BTR Supply' }],
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/public/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FCCF0D'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${modak.variable} ${ibmPlexMono.variable} ${texGyreMath.variable}`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html,
            body {
              height: auto !important;
              min-height: 100vh;
              overflow-x: hidden;
              scroll-behavior: smooth;
            }

            /* Ensure proper height calculation for each page */
            #__next {
              height: auto !important;
              min-height: 100vh;
            }

            /* Reset scroll behavior on route changes */
            [data-nextjs-scroll-focus-boundary] {
              height: auto !important;
            }
          `
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
          <NotificationStack />
          <PageLoader />
        </Providers>
      </body>
    </html>
  );
}
