"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { SITE_DATA } from "@/constants/data";

export const ContactFormSection = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would POST to an API endpoint
        setSubmitted(true);
    };

    return (
        <SectionWrapper id="enquiry" sectionClassName="bg-accent">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left: CTA Message */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">
                        Prioritise Yourself
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight">
                        Get the Care You Deserve
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Put yourself first and invest in your well-being. From our very first conversation, you&apos;ll feel a sense of trust and connection. With a holistic approach, your physical and emotional wellness will always be acknowledged.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Link
                            href={SITE_DATA.general.bookingLink}
                            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-center"
                        >
                            Book a Consultation
                        </Link>
                        <Link
                            href={`tel:${SITE_DATA.general.phone.replace(/\s/g, "")}`}
                            className="inline-block border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 text-center"
                        >
                            Call {SITE_DATA.general.phone}
                        </Link>
                    </div>
                </motion.div>

                {/* Right: Enquiry Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
                >
                    {submitted ? (
                        <div className="text-center py-12 space-y-4">
                            <CheckCircle size={48} className="text-primary mx-auto" />
                            <h3 className="font-serif text-2xl text-white font-bold">Thank You!</h3>
                            <p className="text-white/70">We&apos;ve received your enquiry and will be in touch shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <h3 className="font-serif text-2xl text-white font-bold mb-2">Send an Enquiry</h3>
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>
                            <div>
                                <textarea
                                    name="message"
                                    placeholder="How can we help you?"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Send Enquiry
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </SectionWrapper>
    );
};
