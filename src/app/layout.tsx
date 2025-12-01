"use client";
import { Outfit } from 'next/font/google';
import './globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Providers from "./providers";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const outfit = Outfit({
  subsets: ["latin"],
});
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
      <Providers> 
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider>{children}</SidebarProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </Providers>
      </body>
    </html>
  );
}
