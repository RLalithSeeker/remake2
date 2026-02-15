"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Calendar, BookOpen } from "lucide-react";
import { SectionWrapper } from "@/components/SectionWrapper";
import Link from "next/link";

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
    content: string;
}

interface ResearchPaper {
    id: number;
    title: string;
    abstract: string;
    year: string;
    link: string;
}

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [research, setResearch] = useState<ResearchPaper[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/blogs").then(res => res.json()),
            fetch("/api/research").then(res => res.json()),
        ])
            .then(([blogsData, researchData]) => {
                setBlogs(blogsData);
                setResearch(researchData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Filter logic
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredResearch = research.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="pt-24 min-h-screen bg-secondary">
            <SectionWrapper id="blog-header" className="py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl text-accent font-bold"
                    >
                        Insights & Research
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-accent-gray max-w-2xl mx-auto"
                    >
                        Latest updates in women&apos;s health and our contributions to medical research.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-xl mx-auto mt-8"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search articles and research papers..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-accent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </SectionWrapper>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 space-y-24">

                {/* Blog Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-serif text-3xl text-accent font-bold">Latest Articles</h2>
                        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {loading ? "..." : `${filteredBlogs.length} Article${filteredBlogs.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                                    <div className="h-48 bg-gray-100" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 bg-gray-100 rounded w-1/3" />
                                        <div className="h-6 bg-gray-100 rounded w-full" />
                                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog, index) => (
                                <motion.article
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
                                >
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        <div className="absolute inset-0 bg-secondary flex items-center justify-center text-accent/20">
                                            <BookOpen size={48} />
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-accent uppercase tracking-wider">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center text-sm text-gray-400 space-x-2">
                                            <Calendar size={14} />
                                            <span>{blog.date}</span>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-accent group-hover:text-primary transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                            {blog.excerpt}
                                        </p>
                                        <Link href={`/blog/${blog.id}`} className="inline-block text-primary font-semibold text-sm hover:underline mt-2">
                                            Read More →
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No articles found matching your search.</p>
                    )}
                </section>

                {/* Research Section */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3">
                            <FileText className="text-primary h-8 w-8" />
                            <h2 className="font-serif text-3xl text-accent font-bold">Scientific Research</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-accent">{filteredResearch.length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Publications</div>
                        </div>
                    </div>

                    {filteredResearch.length > 0 ? (
                        <div className="space-y-4">
                            {filteredResearch.map((paper, index) => (
                                <motion.div
                                    key={paper.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-2 max-w-3xl">
                                            <h3 className="font-serif text-lg font-bold text-accent">
                                                {paper.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {paper.abstract}
                                            </p>
                                        </div>
                                        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 min-w-max">
                                            <span className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full text-accent-gray">
                                                {paper.year}
                                            </span>
                                            <Link
                                                href={paper.link}
                                                className="text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 hover:border-primary px-4 py-2 rounded-lg transition-all"
                                            >
                                                View Paper
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No research papers found matching your search.</p>
                    )}
                </section>
            </div>
        </main>
    );
}
