"use client";

import { motion } from "framer-motion";
import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";

export const AboutSection = () => {
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
                    <div className="pt-4">
                        <Link
                            href={SITE_DATA.general.bookingLink}
                            className="inline-block border-b-2 border-primary text-primary font-semibold hover:text-accent hover:border-accent transition-colors pb-1"
                        >
                            Read Full Bio
                        </Link>
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
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                            <span className="text-accent-gray">Listening with compassion to every patient's unique story.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                            <span className="text-accent-gray">Providing evidence-based, top-tier medical care.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                            <span className="text-accent-gray">Ensuring comfort, privacy, and dignity in every interaction.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                            <span className="text-accent-gray">Fluent in English, Hindi, Telugu, Gujarati, and Marathi.</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </SectionWrapper>
    );
};
