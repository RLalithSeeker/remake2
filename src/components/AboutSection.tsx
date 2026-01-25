"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";

const VALUES_LIST = [
    "Listening with compassion to every patient&apos;s unique story.",
    "Providing evidence-based, top-tier medical care.",
    "Ensuring comfort, privacy, and dignity in every interaction.",
    "Fluent in English, Hindi, Telugu, Gujarati, and Marathi.",
];

export const AboutSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isValuesExpanded, setIsValuesExpanded] = useState(false);

    return (
        <SectionWrapper id="about">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="font-serif text-4xl text-accent font-bold">About Dr. Priyanka Karine</h2>
                    <p className="text-accent-gray text-lg leading-relaxed">
                        Expertise with heart.
                    </p>
                    <p className="text-accent-gray leading-relaxed">
                        As a specialist Obstetrician and Gynaecologist (MBBS, MPH, FRANZCOG), I am dedicated to providing holistic, evidence-based care for women in Sydney. My medical journey began in India and continued with advanced training in Sydney, Australia, where I committed myself to supporting women through every stage of life.
                    </p>
                    <p className="text-accent-gray leading-relaxed">
                        With extensive training across India and Australia, including Obstetrics and Gynaecology training and advanced Maternal-Fetal-Medicine training at Westmead and Nepean hospitals, I am experienced in managing both low-risk and complex pregnancies.
                    </p>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                <p className="text-accent-gray leading-relaxed">
                                    I believe in empowering women through education and shared decision-making. Whether you are navigating a high-risk pregnancy or seeking management for complex gynaecological conditions, my goal is to ensure you feel heard, safe, and expertly cared for.
                                </p>
                                <p className="text-accent-gray leading-relaxed">
                                    Fluent in English, Hindi, Telugu, Gujarati, and Marathi, I strive to bridge cultural and linguistic gaps to provide truly personalized care for our diverse community.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-block border-b-2 border-primary text-primary font-semibold hover:text-accent hover:border-accent transition-colors pb-1 outline-none"
                        >
                            {isExpanded ? "Read Less" : "Read Full Bio"}
                        </button>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-secondary/50 p-8 rounded-2xl border border-secondary"
                >
                    <h3 className="font-serif text-2xl text-accent font-bold mb-4">Values & Philosophy</h3>
                    <ul className="space-y-4">
                        {/* Always show first 3 items */}
                        {VALUES_LIST.slice(0, 3).map((value: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                                <span className="text-accent-gray">{value}</span>
                            </li>
                        ))}

                        {/* Conditionally show the rest */}
                        <AnimatePresence>
                            {isValuesExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-4"
                                >
                                    {VALUES_LIST.slice(3).map((value: string, idx: number) => (
                                        <li key={idx + 3} className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                                            <span className="text-accent-gray">{value}</span>
                                        </li>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </ul>

                    {VALUES_LIST.length > 3 && (
                        <div className="pt-4">
                            <button
                                onClick={() => setIsValuesExpanded(!isValuesExpanded)}
                                className="text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1"
                            >
                                {isValuesExpanded ? "Show Less" : "Know More"}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </SectionWrapper>
    );
};
