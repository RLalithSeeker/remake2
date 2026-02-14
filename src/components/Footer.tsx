import Link from "next/link";
import { SITE_DATA } from "@/constants/data";
import { Facebook, Instagram } from "lucide-react";

export const Footer = () => {
    return (
        <footer id="contact" className="bg-secondary-dim border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
                    {/* Brand */}
                    <div className="space-y-4 md:max-w-xs">
                        <h3 className="font-serif text-2xl text-accent font-bold">
                            {SITE_DATA.general.siteName}
                        </h3>
                        <p className="text-accent-gray text-sm leading-relaxed">
                            {SITE_DATA.hero.subheadline}
                        </p>
                        {/* Social Media Links */}
                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href={SITE_DATA.general.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-accent/10 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-accent transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </Link>
                            <Link
                                href={SITE_DATA.general.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-accent/10 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-accent transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-accent font-bold">
                            {SITE_DATA.footer.quickLinksLabel}
                        </h4>
                        <div className="flex flex-col space-y-2">
                            {SITE_DATA.navigation.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-accent-gray hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 md:max-w-xs">
                        <h4 className="font-serif text-lg text-accent font-bold">
                            {SITE_DATA.footer.contactLabel}
                        </h4>
                        <div className="space-y-2 text-sm text-accent-gray">
                            <p>{SITE_DATA.general.address}</p>
                            <p>
                                <Link href={`tel:${SITE_DATA.general.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                                    {SITE_DATA.general.phone}
                                </Link>
                            </p>
                            <p>
                                <Link href={`mailto:${SITE_DATA.general.email}`} className="hover:text-primary transition-colors">
                                    {SITE_DATA.general.email}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
                    <p>{SITE_DATA.footer.copyright}</p>
                    <p className="text-center md:text-right max-w-md">
                        {SITE_DATA.footer.acknowledgement}
                    </p>
                </div>
            </div>
        </footer>
    );
};
