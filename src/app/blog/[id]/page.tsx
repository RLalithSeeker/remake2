"use client";

import { useState, useEffect } from "react";
import { SectionWrapper } from "@/components/SectionWrapper";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen, Loader2 } from "lucide-react";

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
    content: string;
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch(`/api/blogs/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setBlog(data);
                setLoading(false);
                // Dynamic document title for SEO
                document.title = `${data.title} | Dr. Priyanka Karine`;
                // Dynamic meta description
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute("content", data.excerpt);
            })
            .catch(() => {
                setNotFound(true);
                setLoading(false);
            });
    }, [params.id]);

    // Helper to render markdown-like content safely
    const renderContent = (content?: string) => {
        if (!content) return null;
        return content.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-serif font-bold text-accent mt-8 mb-4">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={index} className="font-bold text-accent mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.startsWith('**') && !line.endsWith('**')) {
                const parts = line.split('**');
                if (parts.length >= 3) {
                    return <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">
                        <strong>{parts[1]}</strong>{parts[2]}
                    </p>
                }
            }
            if (line.trim().startsWith('- ')) {
                return <li key={index} className="ml-5 list-disc text-gray-700 mb-2">{line.replace('- ', '')}</li>;
            }
            if (line.trim().startsWith(/\d/.test(line.trim()[0]) ? line.trim()[0] : '')) {
                const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
                if (numMatch) {
                    return <li key={index} className="ml-5 list-decimal text-gray-700 mb-2">{numMatch[2]}</li>;
                }
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            return <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">{line}</p>;
        });
    };

    if (loading) {
        return (
            <main className="pt-24 min-h-screen bg-secondary/30 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </main>
        );
    }

    if (notFound || !blog) {
        return (
            <main className="pt-24 min-h-screen bg-secondary/30 flex flex-col items-center justify-center gap-4">
                <BookOpen className="w-16 h-16 text-accent-gray/30" />
                <h1 className="font-serif text-3xl font-bold text-accent">Article Not Found</h1>
                <p className="text-accent-gray/60">The blog post you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/blog" className="text-primary font-semibold hover:underline mt-4">
                    ← Back to Articles
                </Link>
            </main>
        );
    }

    return (
        <main className="pt-24 min-h-screen bg-secondary/30">
            {/* Header Image Area */}
            <div className="relative h-[40vh] bg-accent w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    <BookOpen size={120} />
                </div>
                <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-6 max-w-4xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </Link>
                    <div className="flex items-center space-x-4 text-white/90 mb-4 text-sm font-medium">
                        <span className="bg-primary/90 px-3 py-1 rounded-full text-white">{blog.category}</span>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {blog.date}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                        {blog.title}
                    </h1>
                </div>
            </div>

            <SectionWrapper className="py-16">
                <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    {/* JSON-LD Structured Data for SEO */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "MedicalWebPage",
                                "headline": blog.title,
                                "description": blog.excerpt,
                                "datePublished": blog.date,
                                "author": {
                                    "@type": "Person",
                                    "name": "Dr. Priyanka Karine",
                                    "jobTitle": "Specialist Obstetrician and Gynaecologist",
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "Dr. Priyanka Karine",
                                },
                                "mainEntityOfPage": {
                                    "@type": "WebPage",
                                },
                            }),
                        }}
                    />

                    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-accent prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80">
                        {renderContent(blog.content)}
                    </div>
                </article>
            </SectionWrapper>
        </main>
    );
}
