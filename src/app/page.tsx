import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { AffiliationsSection } from "@/components/AffiliationsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { LocationsSection } from "@/components/LocationsSection";
import { FAQSection } from "@/components/FAQSection";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <HeroSection />
            <AffiliationsSection />
            <AboutSection />
            <ServicesSection />
            <LocationsSection />
            <FAQSection />
        </div>
    );
}
