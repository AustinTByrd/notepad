import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider } from "@/lib/themes";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents layout shift
  preload: true, // Preloads the font for better performance
  fallback: ["system-ui", "sans-serif"], // Fallback fonts
  adjustFontFallback: true, // Automatically adjusts fallback font metrics
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Super Cute Notes - Fast, Simple Note Taking",
    template: "%s | Super Cute Notes"
  },
  icons: {
    icon: [
      { url: 'https://ccfutxepyndgccdnqawe.supabase.co/storage/v1/object/public/metadata//favicon-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: 'https://ccfutxepyndgccdnqawe.supabase.co/storage/v1/object/public/metadata//favicon-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
      { url: 'https://ccfutxepyndgccdnqawe.supabase.co/storage/v1/object/public/metadata//favicon-ico.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  description: "A fast, simple, note-taking tool. Create, edit, and share notes instantly with automatic saving and beautiful themes.",
  keywords: ["notepad", "notes", "note taking", "text editor", "markdown", "writing", "productivity"],
  authors: [{ name: "Austin Byrd" }],
  creator: "Austin Byrd",
  publisher: "Austin Byrd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "www.supercutenotes.com",
    siteName: "Super Cute Notes",
    title: "Super Cute Notes - Fast, Simple Note Taking",
    description: "A fast, simple, note-taking tool. Create, edit, and share notes instantly with automatic saving and beautiful themes.",
    images: [
      {
        url: "https://ccfutxepyndgccdnqawe.supabase.co/storage/v1/object/public/metadata//og-image.png",
        width: 1200,
        height: 630,
        alt: "Super Cute Notes - Fast, Simple Note Taking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Super Cute Notes - Fast, Simple Note Taking",
    description: "A fast, simple, note-taking tool. Create, edit, and share notes instantly with automatic saving and beautiful themes.",
    images: ["https://ccfutxepyndgccdnqawe.supabase.co/storage/v1/object/public/metadata//og-image.png"],
    creator: "@austintbyrd",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider defaultTheme="default">
            <PageTransition>
              {children}
            </PageTransition>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
