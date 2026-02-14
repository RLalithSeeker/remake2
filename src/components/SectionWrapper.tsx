"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string; // Applied to inner container
    sectionClassName?: string; // Applied to outer section
    id?: string;
    delay?: number;
}

export const SectionWrapper = ({ children, className, sectionClassName, id, delay = 0 }: SectionWrapperProps) => {
    return (
        <section id={id} className={cn("w-full py-8 md:py-16 px-4 md:px-8", sectionClassName)}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: delay, ease: [0.22, 1, 0.36, 1] }}
                className={cn("max-w-7xl mx-auto", className)}
            >
                {children}
            </motion.div>
        </section>
    );
};
