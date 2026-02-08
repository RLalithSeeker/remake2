"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";

export const AffiliationsSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll Marquee Logic
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 0.5;
        const scrollInterval = 15;

        // Clone children for seamless loop effect
        // NOTE: In a production app, we might use CSS animation (marquee) for smoother performance
        // But this JS method provides a quick "endless" feel without complex CSS keyframes setup.

        const scroll = () => {
            if (scrollContainer) {
                // If we've scrolled past the first set, reset to 0
                // (assuming content width is large enough)
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
        };

        const intervalId = setInterval(scroll, scrollInterval);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="bg-white py-16 border-y border-secondary/50 overflow-hidden relative">
            {/* Fade Gradients for visual scrolling hint */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <SectionWrapper className="py-0">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Professional Network</span>
                    <h3 className="font-serif text-3xl md:text-4xl text-accent font-bold">
                        Proudly Affiliated With
                    </h3>
                </div>

                <div
                    ref={scrollRef}
                    className="flex items-center gap-16 md:gap-24 overflow-x-hidden select-none whitespace-nowrap py-4 mask-image-linear-gradient"
                >
                    {/* Render triple the data to ensure smooth looping */}
                    {[...SITE_DATA.affiliations, ...SITE_DATA.affiliations, ...SITE_DATA.affiliations, ...SITE_DATA.affiliations].map((org, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0.4, filter: "grayscale(100%)" }}
                            whileHover={{ opacity: 1, filter: "grayscale(0%)", scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className={`flex-shrink-0 transition-colors ${org.color || 'text-accent-gray'}`}
                        >
                            {org.logo ? (
                                <img
                                    src={org.logo}
                                    alt={org.name}
                                    className="h-12 md:h-16 w-auto object-contain"
                                />
                            ) : (
                                <span className="text-xl md:text-3xl font-serif font-semibold cursor-default">
                                    {org.name}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        </section>
    );
};
