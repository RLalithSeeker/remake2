"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export const LocationsSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const checkScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    // Auto-scroll
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 0.5;
        const scrollInterval = 15;

        const interval = setInterval(() => {
            if (isPaused) return;
            if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft += scrollSpeed;
            }
            checkScrollState();
        }, scrollInterval);

        return () => clearInterval(interval);
    }, [isPaused, checkScrollState]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        setIsPaused(true);
        const amount = 380;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
        setTimeout(checkScrollState, 400);
        // Resume auto-scroll after a delay
        setTimeout(() => setIsPaused(false), 3000);
    };

    return (
        <SectionWrapper id="locations" className="overflow-hidden">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                <h2 className="font-serif text-4xl text-accent font-bold">Consulting Locations</h2>
                <p className="text-accent-gray">
                    Conveniently located across Sydney to serve you better. We offer flexible appointment times at multiple modern facilities.
                </p>
            </div>

            {/* Scroll Container with Arrows */}
            <div className="relative group">
                {/* Left Fade + Arrow */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-secondary to-transparent z-20 pointer-events-none" />
                {canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                {/* Right Fade + Arrow */}
                <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-secondary to-transparent z-20 pointer-events-none" />
                {canScrollRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
                    className="flex overflow-x-auto pb-8 gap-6 select-none scrollbar-hide"
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
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </SectionWrapper>
    );
};
