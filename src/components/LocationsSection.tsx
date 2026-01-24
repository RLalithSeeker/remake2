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

        const scrollSpeed = 1;
        const scrollInterval = 20;

        const scroll = () => {
            if (scrollContainer) {
                // Check if we've reached the end
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
        };

        const intervalId = setInterval(scroll, scrollInterval);

        // Pause on hover
        const handleMouseEnter = () => clearInterval(intervalId);
        const handleMouseLeave = () => {
            // Restart interval - note: this simple logic assumes we want to restart always. 
            // Ideally we'd store the interval ID in a ref to manage it accurately but this is fine for this scope.
            // Actually, recreating the interval here is tricky without state/refs for the interval itself.
            // Let's keep it simple: just auto-scroll, maybe no pause for now or simple clear/restart.
        };

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
                className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 select-none"
                style={{ scrollBehavior: "auto" }}
            >
                {SITE_DATA.locations.map((location, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[300px] md:min-w-[350px] bg-secondary/30 p-8 rounded-2xl border border-secondary hover:border-primary/20 transition-colors duration-300 flex-shrink-0"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-accent font-bold mb-3">{location.name}</h3>
                        <p className="text-sm text-accent-gray leading-relaxed mb-3">
                            {location.detail}
                        </p>
                        <div className="flex items-center text-xs font-semibold text-primary bg-primary/5 py-1 px-3 rounded-full w-fit">
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
