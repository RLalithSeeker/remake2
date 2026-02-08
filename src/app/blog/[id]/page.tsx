"use client";

import { SITE_DATA } from "@/constants/data";
import { SectionWrapper } from "@/components/SectionWrapper";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
// import Image from "next/image"; // Re-enable when images are available

export default function BlogDetailPage({ params }: { params: { id: string } }) {
    const blogId = parseInt(params.id);
    const blog = SITE_DATA.publication.blogs.find((b) => b.id === blogId);

    if (!blog) {
        return notFound();
    }

    // Helper to render markdown-like content safely
    const renderContent = (content?: string) => {
        if (!content) return null;
        return content.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-serif font-bold text-accent mt-8 mb-4">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('**') && line.endsWith('**')) { // Bold headers/lines
                return <p key={index} className="font-bold text-accent mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.startsWith('**') && !line.endsWith('**')) { // Bold start of line
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
            if (line.trim() === '') {
                return <br key={index} />;
            }
            return <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">{line}</p>;
        });
    };

    return (
        <main className="pt-24 min-h-screen bg-secondary/30">
            {/* Header Image Area */}
            <div className="relative h-[40vh] bg-accent w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                {/* Placeholder for actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    <BookOpen size={120} />
                </div>
                {/* 
                 <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill 
                    className="object-cover"
                 />
                 */}
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
                    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-accent prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80">
                        {renderContent(blog.content)}
                    </div>
                </article>
            </SectionWrapper>
        </main>
    );
}
