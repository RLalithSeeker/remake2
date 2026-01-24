"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import { useRef } from "react";

export const HeroSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={ref} className="relative min-h-[100dvh] flex items-center overflow-x-hidden pb-12 pt-24 md:py-32">
            {/* Background with Parallax */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/assets/bg.jpg"
                    alt="Clinic Ambience"
                    fill
                    priority
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent mix-blend-overlay" />
            </motion.div>

            <SectionWrapper className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[inherit]">
                {/* Left Content */}
                <motion.div
                    style={{ y: textY }}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.3,
                                delayChildren: 0.2,
                            },
                        },
                    }}
                    className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start"
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
                        }}
                    >
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-accent font-bold leading-tight text-balance">
                            {SITE_DATA.hero.headline}
                        </h1>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
                        }}
                    >
                        <p className="text-lg md:text-xl text-accent-gray max-w-lg leading-relaxed">
                            {SITE_DATA.hero.subheadline}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
                        }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={SITE_DATA.general.bookingLink}
                                className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 block text-center"
                            >
                                {SITE_DATA.hero.primaryButton}
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#services"
                                className="px-8 py-4 border border-accent text-accent rounded-xl font-semibold hover:bg-accent hover:text-white transition-all duration-300 block text-center"
                            >
                                {SITE_DATA.hero.secondaryButton}
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Right Content - Doctor Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="relative h-[50vh] md:h-[700px] w-full block mt-8 md:mt-0"
                >
                    <Image
                        src="/assets/doctor-cutout.png"
                        alt="Dr. Priyanka Karine"
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </motion.div>
            </SectionWrapper>
        </section>
    );
};
