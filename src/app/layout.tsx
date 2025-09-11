import { Outfit } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProfileProvider } from '@/context/ProfileContext';

export const metadata: Metadata = {
  title: 'CityMaid - Admin Dashboard',
  description: 'CityMaid Admin Dashboard - Manage your services efficiently',
  applicationName: 'CityMaid',
  authors: [{ name: 'CityMaid Team' }],
  generator: 'Next.js',
  keywords: ['CityMaid', 'Admin', 'Dashboard', 'Cleaning Services'],
  themeColor: '#4F46E5',
  colorScheme: 'light dark',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/images/favicon.ico' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'CityMaid Admin Dashboard',
    description: 'Manage your cleaning services efficiently with CityMaid Admin Dashboard',
    url: 'https://citymaid.com',
    siteName: 'CityMaid',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CityMaid Admin Dashboard',
    description: 'Manage your cleaning services efficiently with CityMaid Admin Dashboard',
    creator: '@citymaid',
  },
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
