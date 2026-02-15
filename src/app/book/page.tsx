"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar, Clock, User, Phone, Mail, FileText,
    CheckCircle, Loader2, Info
} from "lucide-react";
import { SectionWrapper } from "@/components/SectionWrapper";
import Link from "next/link";
import { SITE_DATA } from "@/constants/data";

const APPOINTMENT_TYPES = [
    "Initial Consultation",
    "Follow-up Appointment",
    "Obstetrics Check-up",
    "Gynaecology Review",
    "Fertility Consultation",
    "Procedure / Surgery",
    "Other"
];

const TIME_SLOTS = [
    "Morning (9am - 12pm)",
    "Afternoon (12pm - 3pm)",
    "Late Afternoon (3pm - 5pm)"
];

const PREFERRED_DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];

export default function BookingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        patientType: "new", // or "returning"
        name: "",
        email: "",
        phone: "",
        appointmentType: "",
        preferredDay: "",
        preferredTime: "",
        reason: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call delay for UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch {
            alert("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen pt-24 pb-20 bg-secondary flex items-center justify-center">
                <div className="max-w-lg w-full mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-10 shadow-xl text-center border border-primary/10"
                    >
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-accent mb-4">Request Received</h1>
                        <p className="text-accent-gray mb-8 leading-relaxed">
                            Thank you, {formData.name}. We have received your appointment request. Our reception team will contact you shortly at <strong>{formData.phone}</strong> to confirm a specific time.
                        </p>
                        <div className="space-y-3">
                            <Link href="/" className="block w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-all">
                                Return Home
                            </Link>
                            <button
                                onClick={() => { setSubmitted(false); setFormData({ ...formData, name: "", email: "", phone: "", reason: "" }); }}
                                className="block w-full text-accent-gray font-medium py-3.5 hover:text-primary transition-colors"
                            >
                                Book Another Appointment
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-secondary">
            {/* Header Section */}
            <SectionWrapper sectionClassName="pt-32 pb-12 md:pb-20">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest"
                    >
                        Schedule Your Visit
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-6xl text-accent font-bold leading-tight"
                    >
                        Request an Appointment
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-accent-gray font-light"
                    >
                        Begin your journey to better health. Fill out the form below, and our caring staff will reach out to finalize your booking.
                    </motion.p>
                </div>
            </SectionWrapper>

            {/* Form Section */}
            <div className="max-w-4xl mx-auto px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden"
                >
                    {/* Top Info Bar */}
                    <div className="bg-accent/5 px-8 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-accent-gray border-b border-accent/5 text-center">
                        <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" /> {SITE_DATA.general.phone}
                        </span>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> No referral needed for initial inquiry
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        {/* 1. Patient Type */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-accent uppercase tracking-wider">Are you a new patient?</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${formData.patientType === "new" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200"}`}>
                                    <input type="radio" name="patientType" value="new" checked={formData.patientType === "new"} onChange={handleChange} className="hidden" />
                                    <span className="font-semibold">I&apos;m a New Patient</span>
                                </label>
                                <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${formData.patientType === "returning" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200"}`}>
                                    <input type="radio" name="patientType" value="returning" checked={formData.patientType === "returning"} onChange={handleChange} className="hidden" />
                                    <span className="font-semibold">Returning Patient</span>
                                </label>
                            </div>
                        </div>

                        {/* 2. Personal Details */}
                        <div className="space-y-6">
                            <h3 className="font-serif text-2xl font-bold text-accent flex items-center gap-3">
                                <span className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm">1</span>
                                Your Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-accent-gray">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-accent-gray">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0400 000 000"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-accent-gray">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Appointment Preferences */}
                        <div className="space-y-6">
                            <h3 className="font-serif text-2xl font-bold text-accent flex items-center gap-3">
                                <span className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm">2</span>
                                Appointment Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-accent-gray">Appointment Type</label>
                                    <div className="relative">
                                        <select name="appointmentType" value={formData.appointmentType} onChange={handleChange} className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white">
                                            <option value="" disabled>Select Type...</option>
                                            {APPOINTMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-accent-gray">Preferred Day</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <select name="preferredDay" value={formData.preferredDay} onChange={handleChange} className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white">
                                            <option value="" disabled>Select Day...</option>
                                            <option value="Any Day">Any Available Day</option>
                                            {PREFERRED_DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-accent-gray">Preferred Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white">
                                            <option value="" disabled>Select Time...</option>
                                            <option value="Any Time">Any Available Time</option>
                                            {TIME_SLOTS.map(time => <option key={time} value={time}>{time}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-accent-gray">Reason for Visit (Medical concerns, specific questions?)</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <textarea name="reason" value={formData.reason} onChange={handleChange} rows={3} placeholder="Please briefly allow us to understand your needs..."
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col items-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto min-w-[300px] bg-primary hover:bg-primary/90 text-white text-lg font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Request Appointment"}
                            </button>
                            <p className="mt-4 text-xs text-center text-accent-gray/60 max-w-lg">
                                By submitting this form, you agree to our privacy policy. Your information is secure and confidential.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
