import type { Metadata } from "next";
import { Playfair_Display, Figtree } from "next/font/google"; // Changed Lato to Figtree
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const figtree = Figtree({ // Changed Lato to Figtree
    subsets: ["latin"],
    variable: "--font-figtree",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Dr. Priyanka Karine | Luxury Gynecology & Obstetrics",
    description: "Premium care for women's health.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${playfair.variable} ${figtree.variable} font-sans antialiased bg-secondary flex flex-col min-h-screen selection:bg-primary/30 selection:text-accent`}>
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
