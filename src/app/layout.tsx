import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionWrapper from '@/app/Components/SessionWrapper';
import HeaderWrapper from '@/app/Components/HeaderWrapper';
import CartProviderWrapper from './context/CartProviderWrapper';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from '@/hooks/useAlerts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Storevia',
  description: 'Premium Store Network',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <SessionWrapper>
            <CartProviderWrapper>
              <HeaderWrapper>
                {children}
                <Toaster position="top-center" />
              </HeaderWrapper>
            </CartProviderWrapper>
          </SessionWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
