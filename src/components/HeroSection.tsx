"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { SITE_DATA } from "@/constants/data";

export const HeroSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Parallax Effects
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100dvh] flex items-start pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-secondary transition-all"
        >
            {/* 1. Background Image (Absolute) */}
            <motion.div
                style={{ y: yBg }}
                className="absolute inset-0 z-0 select-none"
            >
                <Image
                    src="/assets/bg.jpg"
                    alt="Luxury Clinic Atmosphere"
                    fill
                    priority
                    className="object-cover opacity-60"
                    quality={90}
                />
                {/* Grading Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-secondary to-transparent" />
            </motion.div>

            {/* 2. Content Container - Manually constrained to avoid SectionWrapper's fixed padding */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start h-full">

                    {/* Left: Text Content */}
                    <motion.div
                        style={{ y: yText, opacity: opacityHero }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 pt-12 md:pt-20"
                    >
                        {/* Eyebrow Label */}
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-white/50 backdrop-blur-sm text-accent text-xs font-bold uppercase tracking-widest"
                        >
                            Premier Women&apos;s Health
                        </motion.span>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-accent font-bold leading-[1.1] tracking-tight"
                        >
                            {SITE_DATA.hero.headline}
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-base md:text-xl text-accent-gray/90 max-w-lg font-light leading-relaxed"
                        >
                            {SITE_DATA.hero.subheadline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
                        >
                            <Link
                                href={SITE_DATA.general.bookingLink}
                                className="group relative overflow-hidden bg-primary text-white text-lg font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="relative z-10">Book Appointment</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>

                            <Link
                                href="#services"
                                className="group px-10 py-4 rounded-full border border-accent/30 text-accent font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 backdrop-blur-sm"
                            >
                                Explore Services
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Hero Image (Doctor) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                        className="relative w-full h-[40vh] lg:h-[650px] select-none pointer-events-none lg:-mt-10"
                        style={{
                            maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                            maskComposite: "intersect",
                            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%)",
                            WebkitMaskComposite: "source-in",
                        } as React.CSSProperties}
                    >
                        <Image
                            src="/assets/doctor-cutout-2.png"
                            alt="Dr. Priyanka Karine"
                            fill
                            className="object-contain object-center lg:object-right mix-blend-multiply"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                            quality={100}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
