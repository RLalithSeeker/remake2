"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { Check, X, BookOpen, Quote } from "lucide-react";

// Mock Data for Prototype
const MOCK_INSIGHTS = [
    {
        id: 1,
        category: "Pregnancy Wellness",
        title: "Eating For Two: The Quality Rule",
        summaryPoints: [
            "You only need ~300 extra calories, not double.",
            "Focus on iron-rich foods like spinach and lean meat.",
            "Hydration is more key than portion size."
        ],
        fullContent: "Many expectant mothers feel the pressure to eat significantly more, but the 'eating for two' adage is a myth. The focus should be on nutrient density rather than calorie density. Your baby needs building blocks—proteins, calcium, and iron—not empty sugars. Aim for a balanced diet rich in leafy greens, whole grains, and lean proteins to support fetal growth without unnecessary weight gain."
    },
    {
        id: 2,
        category: "Ultrasound Safety",
        title: "Are Frequent Scans Safe?",
        summaryPoints: [
            "Ultrasounds use sound waves, not radiation.",
            "They are safe for both mother and baby.",
            "Routine scans are vital for monitoring growth."
        ],
        fullContent: "Diagnostic ultrasound has been used for decades in obstetrics and is considered extremely safe. Unlike X-rays, it does not use ionizing radiation. It uses high-frequency sound waves to create images. Frequent scans in high-risk pregnancies are a powerful tool to ensure your baby is developing correctly and to catch any potential complications early."
    },
    {
        id: 3,
        category: "Postpartum Care",
        title: "The Fourth Trimester Reality",
        summaryPoints: [
            "Recovery takes longer than 6 weeks.",
            "Mental health is as important as physical healing.",
            "Don't hesitate to ask for support."
        ],
        fullContent: "The 'Fourth Trimester'—the first 3 months after birth—is a period of immense change. Your body is healing, your hormones are fluctuating, and you are learning to care for a new life. It is normal to feel overwhelmed. Prioritize rest, nutrition, and open communication with your support system. We are here to support you beyond just the delivery room."
    }
];

export const InsightsSection = () => {
    const [selectedInsight, setSelectedInsight] = useState<typeof MOCK_INSIGHTS[0] | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedInsight) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [selectedInsight]);

    return (
        <section id="insights" className="bg-secondary/30 py-12 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">From the Desk of Dr. Priyanka</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-accent font-bold mb-6">
                        Health Insights & Notes
                    </h2>
                    <p className="text-accent-gray/80 text-lg font-light leading-relaxed">
                        Curated medical wisdom, simplified for your journey.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                    {MOCK_INSIGHTS.map((insight) => (
                        <motion.div
                            key={insight.id}
                            whileHover={{ y: -5 }}
                            onClick={() => {
                                // Only open modal on mobile
                                if (window.innerWidth < 768) {
                                    setSelectedInsight(insight);
                                }
                            }}
                            className="relative bg-white rounded-3xl p-8 cursor-pointer md:cursor-default border border-white/50 shadow-sm hover:border-primary/20 hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                        >
                            {/* Category Tag */}
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10">
                                    {insight.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-2xl text-accent font-bold mb-6 leading-tight group-hover:text-primary transition-colors">
                                {insight.title}
                            </h3>

                            {/* Key Points */}
                            <ul className="space-y-4 mb-6">
                                {insight.summaryPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[18px] h-[18px] rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-medium text-accent-gray/90 leading-snug">
                                            {point}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Full Content (Desktop Only) */}
                            <div className="hidden md:block text-accent-gray leading-relaxed mb-6 flex-grow">
                                <p>{insight.fullContent}</p>
                            </div>

                            {/* Read More (Mobile Only) */}
                            <div className="md:hidden font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                                Read Full Insight <BookOpen size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FULL SCREEN MODAL */}
            <AnimatePresence>
                {selectedInsight && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-8">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedInsight(null)}
                            className="absolute inset-0 bg-accent/60 backdrop-blur-md"
                        />

                        {/* Modal Card */}
                        <motion.div
                            layoutId={`insight-${selectedInsight.id}`} // Optional: Layout animation if connected to grid card
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative w-full max-w-2xl max-h-full bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Sticky Header / Close Button */}
                            <div className="p-5 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-20">
                                <span className="text-primary font-bold tracking-widest uppercase text-xs border border-primary/20 px-3 py-1 rounded-full bg-secondary">
                                    {selectedInsight.category}
                                </span>
                                <button
                                    onClick={() => setSelectedInsight(null)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-accent transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto p-5 md:p-10 custom-scrollbar">
                                <h3 className="font-serif text-3xl md:text-4xl text-accent font-bold mb-8 leading-tight">
                                    {selectedInsight.title}
                                </h3>

                                {/* Key Points Box */}
                                <div className="bg-secondary/30 p-6 rounded-2xl mb-10 border border-primary/10">
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                        <Quote size={14} className="fill-primary" /> Key Takeaways
                                    </h4>
                                    <ul className="grid gap-3">
                                        {selectedInsight.summaryPoints.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <Check size={16} className="text-primary mt-1 flex-shrink-0" />
                                                <span className="text-accent-gray font-medium">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Full Text */}
                                <div className="prose prose-lg prose-headings:font-serif prose-p:text-accent-gray prose-p:leading-loose text-accent-gray">
                                    <p className="whitespace-pre-wrap">{selectedInsight.fullContent}</p>
                                    <p className="mt-6">
                                        If you have further questions on this topic, please don&apos;t hesitate to discuss them during your next consultation.
                                    </p>
                                </div>

                                {/* Signature */}
                                <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif italic text-lg">
                                        Dr
                                    </div>
                                    <div>
                                        <div className="font-serif font-bold text-accent">Dr. Priyanka Karine</div>
                                        <div className="text-xs text-accent-gray uppercase tracking-wider">Obstetrician & Gynaecologist</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
