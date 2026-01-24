"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";

export const AffiliationsSection = () => {
    // Reusing the auto-scroll logic from LocationsSection
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 0.5; // Slower for affiliations
        const scrollInterval = 20;

        const scroll = () => {
            if (scrollContainer) {
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
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
        <div className="bg-white py-12 border-b border-secondary overflow-hidden">
            <SectionWrapper className="py-0">
                <div className="text-center mb-10">
                    <h3 className="font-serif text-2xl text-accent font-bold text-center">
                        I Am Proud to Be Affiliated With
                    </h3>
                </div>

                <div
                    ref={scrollRef}
                    className="flex items-center gap-12 md:gap-20 overflow-x-auto scrollbar-hide select-none whitespace-nowrap"
                    style={{ scrollBehavior: "auto" }}
                >
                    {/* Duplicate array for seamless loops illusion (simple version just repeats) */}
                    {[...SITE_DATA.affiliations, ...SITE_DATA.affiliations, ...SITE_DATA.affiliations].map((org, index) => (
                        <motion.div
                            key={index}
                            className={`text-xl md:text-2xl font-bold cursor-default flex-shrink-0 ${org.color || 'text-accent-gray'}`}
                        >
                            {org.name}
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
        </div>
    );
};
