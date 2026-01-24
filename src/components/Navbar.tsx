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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                    scrolled || isOpen ? "bg-secondary/80 backdrop-blur-md border-white/20 shadow-sm" : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="font-serif text-2xl text-accent font-bold tracking-tight">
                            {SITE_DATA.general.siteName}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {SITE_DATA.navigation.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-accent-gray hover:text-primary transition-colors text-sm font-medium tracking-wide"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:block">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href={SITE_DATA.general.bookingLink}
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                                >
                                    Book Consultation
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-accent p-2 rounded-lg hover:bg-black/5"
                                aria-label="Toggle menu"
                            >
                                {<Menu size={24} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-secondary flex flex-col items-center justify-center p-8"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 p-2 text-accent hover:bg-black/5 rounded-full"
                            >
                                <X size={32} />
                            </button>

                            {/* Menu Items */}
                            <div className="flex flex-col items-center space-y-8">
                                {SITE_DATA.navigation.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="font-serif text-3xl md:text-4xl text-accent font-medium hover:text-primary transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: SITE_DATA.navigation.length * 0.1 }}
                                    className="pt-8"
                                >
                                    <Link
                                        href={SITE_DATA.general.bookingLink}
                                        onClick={() => setIsOpen(false)}
                                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transition-all active:scale-95"
                                    >
                                        Book Consultation
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};
