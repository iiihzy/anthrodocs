import type { Metadata } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-mono-one",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tokengo.com"),
  title: "TokenGO",
  description: "LLM API interface aggregation and distribution platform.",
  icons: {
    icon: "/images/tokengo.svg",
    shortcut: "/images/tokengo.svg",
    apple: "/images/tokengo.svg"
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-74VT4VWNWD"
          strategy="afterInteractive"
          async
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-74VT4VWNWD');
          `}
        </Script>
        {/* Reddit Pixel */}
        <Script id="reddit-pixel" strategy="afterInteractive">
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_ivzzah9rnxqj",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_ivzzah9rnxqj');rdt('track', 'PageVisit');
          `}
        </Script>
        {/* DO NOT MODIFY UNLESS TO REPLACE A USER IDENTIFIER */}
        {/* End Reddit Pixel */}
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${inter.className} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
      >
        <AnnouncementBanner />
        <SiteHeader />
        {children}
        <SiteFooter />
        {/* Hide header/footer when embedded in iframe via ?embed=true */}
        <style dangerouslySetInnerHTML={{ __html: `body.iframe-embed header, body.iframe-embed footer { display: none !important; }` }} />
      </body>
    </html>
  );
}
