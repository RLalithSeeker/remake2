"use client";

import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import { IconMap } from "./icons/ServiceIcons";
import { WobbleCard } from "./WobbleCard";

export const ServicesSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div className="bg-secondary-dim py-20">
            <SectionWrapper>
                <motion.div
                    id="services"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="space-y-16"
                >
                    {/* Section Header */}
                    <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="font-serif text-4xl text-accent font-bold">Our Services</h2>
                        <p className="text-accent-gray">
                            Comprehensive care designed for every stage of a woman's life.
                        </p>
                    </motion.div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {SITE_DATA.services.map((service, index) => {
                            const IconComponent = IconMap[service.iconKey];
                            return (
                                <motion.div
                                    key={service.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.01)" }}
                                    className="group bg-white p-8 rounded-xl shadow-sm transition-all duration-500 flex flex-col space-y-4 border border-gray-100 cursor-default"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="p-4 bg-secondary rounded-full text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-500"
                                        >
                                            {IconComponent ? <IconComponent size={32} /> : null}
                                        </motion.div>
                                        <h3 className="font-serif text-2xl text-accent font-bold group-hover:text-primary transition-colors duration-300 mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-accent-gray leading-relaxed opacity-80 mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Detailed Features List */}
                                    {(service as any).features && (
                                        <ul className="space-y-3 text-left w-full border-t border-gray-100 pt-6">
                                            {(service as any).features.map((feature: string, idx: number) => (
                                                <li key={idx} className="flex items-start text-sm text-accent-gray">
                                                    <span className="mr-2 text-primary mt-1">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};
