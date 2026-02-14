import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { AffiliationsSection } from "@/components/AffiliationsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { LocationsSection } from "@/components/LocationsSection";
import { InsightsSection } from "@/components/InsightsSection";
import { FirstVisitSection } from "@/components/FirstVisitSection";
import { ContactFormSection } from "@/components/ContactFormSection";
import { FAQSection } from "@/components/FAQSection";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <HeroSection />
            <AffiliationsSection />
            <AboutSection />
            <ServicesSection />
            <LocationsSection />
            <FirstVisitSection />
            <InsightsSection />
            <ContactFormSection />
            <FAQSection />
        </div>
    );
}
