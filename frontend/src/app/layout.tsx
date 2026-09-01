import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AnnouncementBar } from "@/components/common/AnnouncementBar";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FloatingAIChat } from "@/components/ai/FloatingAIChat";

export const metadata: Metadata = {
  title: "AuraLuxe — Women's Fashion & Designer Dresses",
  description: "Exquisite contemporary dresses, Indian couture, Korean minimalist silhouettes, and luxury fashion for women.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-[#fdfbf7] text-stone-900 selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <FloatingAIChat />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
