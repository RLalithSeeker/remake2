"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import { IconMap } from "./icons/ServiceIcons";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ServicesSection = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const scrollAmount = 300; // Approx card width

            if (direction === "right") {
                // If near end, loop back to start
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
            } else {
                // If at start, loop to end
                if (scrollLeft <= 10) {
                    scrollContainerRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
                } else {
                    scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                }
            }
        }
    };

    // Touch handling for smart loop swipe
    const touchStartRef = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!scrollContainerRef.current) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStartRef.current - touchEnd;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const threshold = 50; // Minimum swipe distance

        // Swipe Left (intent to go Next)
        if (diff > threshold) {
            // If at end, loop to start
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                // Prevent default snap behavior from trapping us, force scroll to start
                scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
            }
        }

        // Swipe Right (intent to go Prev)
        if (diff < -threshold) {
            // If at start, loop to end
            if (scrollLeft <= 10) {
                scrollContainerRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
            }
        }
    };

    // Animation Variants
    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVars = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        },
    };

    return (
        <section id="services" className="py-12 md:py-32 bg-secondary-dim relative overflow-hidden -mt-24 z-20">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <SectionWrapper>
                {/* 1. Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4 md:space-y-6">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Expertise</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-accent font-bold">
                        Compassionate Care for Every Stage
                    </h2>
                    <p className="text-base md:text-lg text-accent-gray/80 font-light leading-relaxed">
                        We provide comprehensive obstetrics and gynecology services tailored to your unique needs, ensuring you feel heard, safe, and empowered.
                    </p>
                </div>

                {/* 2. Services Grid / Mobile Carousel */}
                <div className="relative group/carousel">
                    <motion.div
                        ref={scrollContainerRef}
                        variants={containerVars}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {SITE_DATA.services.map((service: any, index: number) => {
                            const IconComponent = IconMap[service.iconKey];

                            return (
                                <motion.div
                                    key={service.id}
                                    variants={cardVars}
                                    whileHover={{
                                        y: -8,
                                        boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)"
                                    }}
                                    className="group relative bg-white rounded-2xl p-8 border border-transparent hover:border-primary/10 transition-all duration-300 shadow-sm overflow-hidden min-w-[85vw] md:min-w-0 snap-center snap-always flex flex-col"
                                >
                                    {/* Decorative Large Icon Watermark */}
                                    <div className="absolute -right-8 -top-8 text-primary/5 group-hover:text-primary/10 transition-colors duration-500 scale-[2.5] origin-center rotate-12 pointer-events-none">
                                        {IconComponent && <IconComponent size={100} />}
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Icon Circle */}
                                        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                                            {IconComponent && <IconComponent size={28} />}
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-serif text-2xl text-accent font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                            {service.title}
                                        </h3>

                                        <p className="text-accent-gray/80 leading-relaxed mb-6 flex-grow font-sans">
                                            {service.description}
                                        </p>

                                        {/* Bullet Points */}
                                        {service.features && (
                                            <ul className="space-y-3 pt-6 border-t border-gray-100">
                                                {service.features.map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center text-sm text-accent-gray font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-3 group-hover:bg-primary transition-colors" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Mobile Navigation Buttons */}
                    <div className="flex md:hidden justify-center gap-4 mt-4">
                        <button
                            onClick={() => scroll("left")}
                            className="p-3 rounded-full bg-white border border-accent/10 shadow-sm text-accent hover:bg-accent hover:text-white transition-all active:scale-95"
                            aria-label="Previous service"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-3 rounded-full bg-white border border-accent/10 shadow-sm text-accent hover:bg-accent hover:text-white transition-all active:scale-95"
                            aria-label="Next service"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </SectionWrapper>
        </section>
    );
};
