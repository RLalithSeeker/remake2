"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import { Plus, Minus } from "lucide-react";

export const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <SectionWrapper id="faq">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="font-serif text-4xl text-accent font-bold">Frequently Asked Questions</h2>
                    <p className="text-accent-gray">
                        Clear answers to guide you on your health journey.
                    </p>
                </div>

                <div className="space-y-4">
                    {SITE_DATA.faq.map((item, index) => (
                        <div
                            key={index}
                            className="bg-secondary/30 rounded-2xl border border-secondary transition-colors duration-300"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-serif text-lg text-accent font-semibold pr-8">
                                    {item.question}
                                </span>
                                <div className="flex-shrink-0 text-primary">
                                    {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-accent-gray leading-relaxed border-t border-secondary/50 mt-2">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};
