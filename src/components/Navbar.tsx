"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_DATA } from "@/constants/data";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Track scrolling for glass effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            {/* 
              Fixed Navbar 
              z-index 100 ensures it stays above Hero content.
            */}
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-[120] transition-all duration-500",
                    scrolled || isOpen
                        ? "bg-secondary/90 backdrop-blur-lg border-b border-primary/10 shadow-sm py-4"
                        : "bg-transparent py-6"
                )}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* 1. Logo */}
                        <Link
                            href="/"
                            className="relative z-[120] font-serif text-2xl md:text-3xl font-bold text-accent tracking-tight"
                            onClick={() => setIsOpen(false)}
                        >
                            {SITE_DATA.general.siteName}
                        </Link>

                        {/* 2. Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {SITE_DATA.navigation.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-accent-gray hover:text-primary font-medium text-[15px] transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <Link
                                href={SITE_DATA.general.bookingLink}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Book Consultation
                            </Link>
                        </div>

                        {/* 3. Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden relative z-[120] p-2 text-accent hover:bg-black/5 rounded-full transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* 
              Mobile Menu Overlay 
              z-index 110 ensures it covers the navbar background but sits under the logo/toggle (z-120).
              Fixed inset-0 ensures it covers the WHOLE screen.
            */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[110] bg-secondary/95 flex flex-col justify-center items-center"
                    >
                        <div className="flex flex-col items-center space-y-8 text-center p-4">
                            {SITE_DATA.navigation.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="font-serif text-3xl md:text-5xl text-accent font-bold hover:text-primary transition-colors block py-2"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="pt-8"
                            >
                                <Link
                                    href={SITE_DATA.general.bookingLink}
                                    onClick={() => setIsOpen(false)}
                                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-xl block w-full max-w-xs mx-auto"
                                >
                                    Book Consultation
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
