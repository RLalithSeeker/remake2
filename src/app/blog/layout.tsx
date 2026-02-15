import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Health Articles & Insights",
    description: "Expert articles on women's health, pregnancy, menopause, gynaecological conditions, and preventive screening by Dr. Priyanka Karine — Specialist Obstetrician & Gynaecologist in Sydney.",
    keywords: ["women's health blog", "pregnancy articles", "menopause information", "gynaecology articles", "cervical screening", "ovarian cancer", "endometriosis"],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Health Articles & Insights | Dr. Priyanka Karine",
        description: "Expert articles on women's health, pregnancy, menopause, and gynaecological conditions.",
        type: "website",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
