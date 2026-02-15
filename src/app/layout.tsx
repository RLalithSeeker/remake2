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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyankakarine.com.au";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Dr. Priyanka Karine | Specialist Obstetrician & Gynaecologist | Sydney",
        template: "%s | Dr. Priyanka Karine",
    },
    description: "Dedicated to providing holistic, evidence-based obstetric and gynaecological care for women in Sydney. From preconception to postpartum and beyond — expertise with heart.",
    keywords: ["obstetrician", "gynaecologist", "women's health", "Sydney", "pregnancy care", "Dr Priyanka Karine", "high-risk pregnancy", "ultrasound", "menopause", "endometriosis", "PCOS", "gynaecological surgery"],
    authors: [{ name: "Dr. Priyanka Karine" }],
    creator: "Dr. Priyanka Karine",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_AU",
        siteName: "Dr. Priyanka Karine",
        title: "Dr. Priyanka Karine | Specialist Obstetrician & Gynaecologist",
        description: "Holistic, evidence-based obstetric and gynaecological care for women in Sydney.",
        images: [
            {
                url: "/assets/doctor-cutout.jpg",
                width: 1200,
                height: 630,
                alt: "Dr. Priyanka Karine — Specialist Obstetrician & Gynaecologist, Sydney",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Dr. Priyanka Karine | Specialist Obstetrician & Gynaecologist",
        description: "Holistic, evidence-based obstetric and gynaecological care for women in Sydney.",
        images: ["/assets/doctor-cutout.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
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
