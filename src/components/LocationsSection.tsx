"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import { MapPin } from "lucide-react";

export const LocationsSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 0.5; // Matched speed with Affiliations
        const scrollInterval = 15;

        const scroll = () => {
            if (scrollContainer) {
                // If we've scrolled past the first half (containing first 2 sets), reset to 0
                // This assumes we are rendering 4 sets of data
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
        };

        const intervalId = setInterval(scroll, scrollInterval);

        // Pause on hover (keeping this as it's useful for reading location details)
        const handleMouseEnter = () => clearInterval(intervalId);
        const handleMouseLeave = () => {
            // We need to restart the interval. 
            // Since we can't easily restart the same intervalId, we essentially rely on a re-render or just simple clearing.
            // However, strictly complying with "same logic" might imply removing pause? 
            // But reading locations requires pausing. 
            // The previous code had empty handleMouseLeave. 
            // To make it restart, we'd need to extract the interval logic.
            // For now, let's keep it simple and just let it auto-scroll continuously if we don't want pause, 
            // OR properly implement pause/resume.
            // Given the user said "same logic... as Affiliate", Affiliate DOES NOT pause.
            // But Locations have text. I will remove the pause to strictly follow "same logic" request 
            // and because the previous pause implementation was incomplete (empty mouseLeave).
        };

        // Actually, let's just use the exact logic from Affiliations which has no pause.
        return () => clearInterval(intervalId);
    }, []);

    return (
        <SectionWrapper id="locations" className="overflow-hidden">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                <h2 className="font-serif text-4xl text-accent font-bold">Consulting Locations</h2>
                <p className="text-accent-gray">
                    Conveniently located across Sydney to serve you better. We offer flexible appointment times at multiple modern facilities.
                </p>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-hidden pb-8 gap-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 select-none mask-image-linear-gradient"
                style={{ scrollBehavior: "auto" }}
            >
                {/* Render data 4 times for seamless looping */}
                {[...SITE_DATA.locations, ...SITE_DATA.locations, ...SITE_DATA.locations, ...SITE_DATA.locations].map((location, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0.8 }}
                        whileHover={{ scale: 1.02, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-[350px] md:w-[400px] bg-secondary/30 p-8 rounded-2xl border border-secondary hover:border-primary/20 transition-all duration-300 flex-shrink-0 whitespace-normal"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-serif text-2xl text-accent font-bold mb-3">{location.name}</h3>
                        <p className="text-base text-accent-gray leading-relaxed mb-3">
                            {location.detail}
                        </p>
                        <div className="flex items-center text-sm font-semibold text-primary bg-primary/5 py-1 px-3 rounded-full w-fit">
                            <span className="mr-1">🕒</span>
                            {location.timing}
                        </div>
                    </motion.div>
                ))}
                <style jsx global>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </SectionWrapper>
    );
};
