"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { Heart, ClipboardList, Ear, Stethoscope, Lightbulb } from "lucide-react";
import Link from "next/link";
import { SITE_DATA } from "@/constants/data";

const STEPS = [
    {
        icon: Heart,
        title: "Receive a Warm Welcome",
        description: "We want your first visit to be comfortable and stress-free. Our front desk team will greet you, complete registration and make you feel at ease.",
    },
    {
        icon: ClipboardList,
        title: "Getting to Know You",
        description: "We will go through your medical history, lifestyle, and any specific concerns or goals you may have. This helps us understand you better and provide the right care.",
    },
    {
        icon: Ear,
        title: "Be Heard with Compassion",
        description: "I value listening to you, answering your questions, and explaining your options in clear, simple language. Informed decision-making is of utmost importance at our clinic.",
    },
    {
        icon: Stethoscope,
        title: "Undergo an Examination",
        description: "An examination and/or tests are offered only if relevant and always explained beforehand, so you know exactly what's happening.",
    },
    {
        icon: Lightbulb,
        title: "Get Clear, Tailored Advice",
        description: "Together we will create a plan that supports your health and wellbeing — tailored just for you.",
    },
];

export const FirstVisitSection = () => {
    return (
        <SectionWrapper id="first-visit">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">Your Journey Starts Here</span>
                <h2 className="font-serif text-4xl text-accent font-bold">What to Expect at Your First Visit</h2>
                <p className="text-accent-gray">
                    We know that walking into a clinic for the first time can feel overwhelming. Here&apos;s what you can expect.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {STEPS.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative bg-secondary/30 p-6 rounded-2xl border border-secondary hover:border-primary/20 transition-all duration-300 text-center group"
                    >
                        {/* Step Number */}
                        <div className="absolute -top-3 -left-1 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                            {index + 1}
                        </div>

                        {/* Icon */}
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                            <step.icon size={28} />
                        </div>

                        <h3 className="font-serif text-lg text-accent font-bold mb-2">{step.title}</h3>
                        <p className="text-sm text-accent-gray leading-relaxed">{step.description}</p>

                        {/* Connector line (hidden on last & mobile) */}
                        {index < STEPS.length - 1 && (
                            <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-primary/20" />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center mt-10"
            >
                <Link
                    href={SITE_DATA.general.bookingLink}
                    className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                    Book Your First Consultation
                </Link>
            </motion.div>
        </SectionWrapper>
    );
};
