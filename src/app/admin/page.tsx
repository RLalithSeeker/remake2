"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogIn, Plus, Pencil, Trash2, X, Save, ArrowLeft,
    FileText, Calendar, Tag, AlignLeft, Image as ImageIcon,
    Eye, Loader2, LogOut, Shield, BookOpen, Upload,
    ExternalLink, GraduationCap, Phone, Check
} from "lucide-react";
import Link from "next/link";

/* ─── Interfaces ─── */
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

interface Booking {
    id: number;
    timestamp: number;
    date: string;
    name: string;
    email: string;
    phone: string;
    patientType: string;
    appointmentType: string;
    preferredDay: string;
    preferredTime: string;
    reason: string;
    status: string;
}

type BlogFormData = Omit<Blog, "id"> & { id?: number };
type ResearchFormData = Omit<ResearchPaper, "id"> & { id?: number };

const EMPTY_BLOG: BlogFormData = {
    title: "", excerpt: "", date: "", category: "", image: "/assets/blog-1.jpg", content: "",
};

const EMPTY_RESEARCH: ResearchFormData = {
    title: "", abstract: "", year: new Date().getFullYear().toString(), link: "",
};

const DEFAULT_CATEGORIES = ["Menopause", "Oncology", "Screening", "Gynaecology", "Obstetrics", "Wellness", "Research"];

type Tab = "blogs" | "research" | "bookings";

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<"admin" | "assistant" | null>(null); // New Role State
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [activeTab, setActiveTab] = useState<Tab>("blogs");
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    /* Blog state */
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [blogForm, setBlogForm] = useState<BlogFormData>(EMPTY_BLOG);
    const [blogSaving, setBlogSaving] = useState(false);
    const [deleteBlogConfirm, setDeleteBlogConfirm] = useState<number | null>(null);

    /* Research state */
    const [research, setResearch] = useState<ResearchPaper[]>([]);
    const [researchLoading, setResearchLoading] = useState(false);
    const [showResearchForm, setShowResearchForm] = useState(false);
    const [editingResearch, setEditingResearch] = useState<ResearchPaper | null>(null);
    const [researchForm, setResearchForm] = useState<ResearchFormData>(EMPTY_RESEARCH);
    const [researchSaving, setResearchSaving] = useState(false);
    const [deleteResearchConfirm, setDeleteResearchConfirm] = useState<number | null>(null);

    /* Booking state */
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [deleteBookingConfirm, setDeleteBookingConfirm] = useState<number | null>(null);
    const [showManualBooking, setShowManualBooking] = useState(false); // Manual booking modal
    const [bookingFilter, setBookingFilter] = useState<"all" | "new" | "contacted" | "completed">("all");
    const [editingBooking, setEditingBooking] = useState<any | null>(null);

    /* Image upload state */
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* Custom category state */
    const [customCategory, setCustomCategory] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Check session on mount
    useEffect(() => {
        const savedToken = sessionStorage.getItem("admin_token");
        const savedRole = sessionStorage.getItem("admin_role") as "admin" | "assistant";
        if (savedToken) {
            setToken(savedToken);
            setRole(savedRole || "admin"); // Default to admin for backward compatibility
            if (savedRole === "assistant") setActiveTab("bookings");
        }
    }, []);

    const showNotif = (type: "success" | "error", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    /* ─── AUTH ─── */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError("");
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                setToken(data.token);
                setRole(data.role); // Save role
                sessionStorage.setItem("admin_token", data.token);
                sessionStorage.setItem("admin_role", data.role);
                if (data.role === "assistant") setActiveTab("bookings");
            } else {
                setLoginError(data.error || "Login failed.");
            }
        } catch {
            setLoginError("Network error. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setRole(null);
        sessionStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_role");
        setPassword("");
        setActiveTab("blogs"); // Reset tab
    };

    /* ─── BLOGS CRUD ─── */
    const fetchBlogs = useCallback(async () => {
        setBlogLoading(true);
        try {
            const res = await fetch("/api/blogs");
            setBlogs(await res.json());
        } catch { showNotif("error", "Failed to load blogs."); }
        finally { setBlogLoading(false); }
    }, []);

    const fetchResearch = useCallback(async () => {
        setResearchLoading(true);
        try {
            const res = await fetch("/api/research");
            setResearch(await res.json());
        } catch { showNotif("error", "Failed to load research."); }
        finally { setResearchLoading(false); }
    }, []);

    const fetchBookings = useCallback(async () => {
        setBookingLoading(true);
        try {
            const res = await fetch("/api/booking", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setBookings(await res.json());
            }
        } catch { showNotif("error", "Failed to load bookings."); }
        finally { setBookingLoading(false); }
    }, [token]);

    useEffect(() => {
        if (token) { fetchBlogs(); fetchResearch(); fetchBookings(); }
    }, [token, fetchBlogs, fetchResearch, fetchBookings]);

    // Get all unique categories from existing blogs
    const existingCategories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));
    const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories]));

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBlogSaving(true);
        const isEdit = editingBlog !== null;
        try {
            const res = await fetch(isEdit ? `/api/blogs/${editingBlog.id}` : "/api/blogs", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(blogForm),
            });
            if (res.ok) {
                showNotif("success", isEdit ? "Blog updated!" : "Blog created!");
                setShowBlogForm(false); setEditingBlog(null); setBlogForm(EMPTY_BLOG);
                setImagePreview("");
                fetchBlogs();
            } else {
                const d = await res.json();
                showNotif("error", d.error || "Failed.");
            }
        } catch { showNotif("error", "Network error."); }
        finally { setBlogSaving(false); }
    };

    const handleBlogDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/blogs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { showNotif("success", "Blog deleted."); setDeleteBlogConfirm(null); fetchBlogs(); }
            else showNotif("error", "Failed to delete.");
        } catch { showNotif("error", "Network error."); }
    };

    /* ─── RESEARCH CRUD ─── */
    const handleResearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResearchSaving(true);
        const isEdit = editingResearch !== null;
        try {
            const res = await fetch(isEdit ? `/api/research/${editingResearch.id}` : "/api/research", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(researchForm),
            });
            if (res.ok) {
                showNotif("success", isEdit ? "Paper updated!" : "Paper added!");
                setShowResearchForm(false); setEditingResearch(null); setResearchForm(EMPTY_RESEARCH);
                fetchResearch();
            } else {
                const d = await res.json();
                showNotif("error", d.error || "Failed.");
            }
        } catch { showNotif("error", "Network error."); }
        finally { setResearchSaving(false); }
    };

    const handleResearchDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/research/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { showNotif("success", "Paper deleted."); setDeleteResearchConfirm(null); fetchResearch(); }
            else showNotif("error", "Failed to delete.");
        } catch { showNotif("error", "Network error."); }
    };

    /* ─── BOOKINGS CRUD ─── */
    const handleBookingDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/booking/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { showNotif("success", "Booking deleted."); setDeleteBookingConfirm(null); fetchBookings(); }
            else showNotif("error", "Failed to delete.");
        } catch { showNotif("error", "Network error."); }
    };

    const handleBookingStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/booking/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                showNotif("success", `Booking marked as ${status}.`);
                fetchBookings();
            } else {
                showNotif("error", "Failed to update status.");
            }
        } catch {
            showNotif("error", "Network error.");
        }
    };

    // ... (rest of code)



    /* ─── IMAGE UPLOAD ─── */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setBlogForm(prev => ({ ...prev, image: data.path }));
                showNotif("success", "Image uploaded!");
            } else {
                showNotif("error", data.error || "Upload failed.");
                setImagePreview("");
            }
        } catch {
            showNotif("error", "Upload failed.");
            setImagePreview("");
        } finally {
            setUploading(false);
        }
    };

    /* ─── CATEGORY HELPERS ─── */
    const filteredCategoryOptions = allCategories.filter(cat =>
        cat.toLowerCase().includes((blogForm.category || customCategory).toLowerCase())
    );

    const selectCategory = (cat: string) => {
        setBlogForm(prev => ({ ...prev, category: cat }));
        setCustomCategory("");
        setShowCategoryDropdown(false);
    };

    /* ─── MANUAL BOOKING / EDIT ─── */
    const handleManualBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const bookingData = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            patientType: formData.get("patientType"),
            appointmentType: formData.get("appointmentType"),
            preferredDay: formData.get("preferredDay"),
            preferredTime: formData.get("preferredTime"),
            reason: formData.get("reason"),
            status: editingBooking ? editingBooking.status : "new", // Keep existing status if editing
            source: editingBooking ? editingBooking.source : "manual"
        };

        try {
            const url = editingBooking ? `/api/booking/${editingBooking.id}` : "/api/booking";
            const method = editingBooking ? "PATCH" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });

            if (res.ok) {
                showNotif("success", editingBooking ? "Booking updated!" : "Booking added!");
                setShowManualBooking(false);
                setEditingBooking(null);
                fetchBookings();
            } else {
                showNotif("error", editingBooking ? "Failed to update." : "Failed to add.");
            }
        } catch {
            showNotif("error", "Network error.");
        }
    };

    const handleBookingStatusUpdate = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/booking/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                showNotif("success", `Marked as ${newStatus}!`);
                fetchBookings();
            } else {
                showNotif("error", "Update failed.");
            }
        } catch {
            showNotif("error", "Network error.");
        }
    };




    /* ─── LOGIN SCREEN ─── */
    if (!token) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                    <Link href="/" className="inline-flex items-center text-accent-gray/60 hover:text-accent mb-8 text-sm transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to website
                    </Link>
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="font-serif text-3xl font-bold text-accent mb-2">Staff Access</h1>
                            <p className="text-accent-gray/60 text-sm">Enter your access password to continue.</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-accent mb-2">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter access password"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent"
                                    required autoFocus />
                            </div>
                            {loginError && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl font-medium">{loginError}</motion.p>
                            )}
                            <button type="submit" disabled={loginLoading || !password}
                                className="w-full bg-accent text-white py-3.5 rounded-xl font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" /> Sign In</>}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </main>
        );
    }

    /* ─── ADMIN DASHBOARD ─── */
    return (
        <main className="min-h-screen bg-secondary/30 pt-24">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-28 left-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-medium text-sm ${notification.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-accent">Content Management</h1>
                        <p className="text-accent-gray/60 mt-1">Manage blog posts, research, and appointments.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleLogout}
                            className="bg-white text-accent-gray px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200">
                            <LogOut className="w-4 h-4" /> Log Out
                        </button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 border border-gray-100 w-full md:w-fit overflow-x-auto scrollbar-hide">
                    {role === "admin" && (
                        <>
                            <button onClick={() => setActiveTab("blogs")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "blogs" ? "bg-primary text-white shadow-sm" : "text-accent-gray/60 hover:text-accent hover:bg-gray-50"}`}>
                                <BookOpen className="w-4 h-4" /> Blog Posts
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "blogs" ? "bg-white/20" : "bg-gray-100"}`}>{blogs.length}</span>
                            </button>
                            <button onClick={() => setActiveTab("research")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "research" ? "bg-primary text-white shadow-sm" : "text-accent-gray/60 hover:text-accent hover:bg-gray-50"}`}>
                                <GraduationCap className="w-4 h-4" /> Research
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "research" ? "bg-white/20" : "bg-gray-100"}`}>{research.length}</span>
                            </button>
                        </>
                    )}
                    <button onClick={() => setActiveTab("bookings")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "bookings" ? "bg-primary text-white shadow-sm" : "text-accent-gray/60 hover:text-accent hover:bg-gray-50"}`}>
                        <Calendar className="w-4 h-4" /> Appointments
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "bookings" ? "bg-white/20" : "bg-gray-100"}`}>{bookings.length}</span>
                    </button>
                </div>

                {/* ═══════════════ BLOGS TAB ═══════════════ */}
                {activeTab === "blogs" && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                <p className="text-3xl font-bold text-accent">{blogs.length}</p>
                                <p className="text-xs text-accent-gray/60 uppercase tracking-wider mt-1">Total Posts</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                <p className="text-3xl font-bold text-primary">
                                    {Array.from(new Set(blogs.map(b => b.category))).length}
                                </p>
                                <p className="text-xs text-accent-gray/60 uppercase tracking-wider mt-1">Categories</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                <p className="text-3xl font-bold text-accent">{blogs.length > 0 ? blogs[0].date : "—"}</p>
                                <p className="text-xs text-accent-gray/60 uppercase tracking-wider mt-1">Latest Post</p>
                            </div>
                            <button onClick={() => { setEditingBlog(null); setBlogForm(EMPTY_BLOG); setImagePreview(""); setShowBlogForm(true); }}
                                className="bg-primary text-white rounded-2xl p-5 hover:bg-primary/90 transition-colors flex items-center gap-3">
                                <Plus className="w-6 h-6" />
                                <div className="text-left">
                                    <p className="font-semibold text-sm">New Blog Post</p>
                                    <p className="text-xs text-white/60">Create article</p>
                                </div>
                            </button>
                        </div>

                        {/* Blog List */}
                        {blogLoading ? (
                            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <BookOpen className="w-12 h-12 text-accent-gray/30 mx-auto mb-4" />
                                <p className="text-accent-gray/60">No blog posts yet. Create your first one!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {blogs.map((blog, index) => (
                                    <motion.div key={blog.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{blog.category}</span>
                                                    <span className="text-xs text-accent-gray/50 flex items-center gap-1"><Calendar className="w-3 h-3" />{blog.date}</span>
                                                </div>
                                                <h3 className="font-serif text-lg font-bold text-accent truncate group-hover:text-primary transition-colors">{blog.title}</h3>
                                                <p className="text-sm text-accent-gray/60 mt-1 line-clamp-1">{blog.excerpt}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link href={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer"
                                                    className="p-2.5 rounded-xl text-accent-gray/40 hover:text-primary hover:bg-primary/5 transition-all" title="Preview in new tab">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => { setEditingBlog(blog); setBlogForm({ ...blog }); setImagePreview(blog.image); setShowBlogForm(true); }}
                                                    className="p-2.5 rounded-xl text-accent-gray/40 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {deleteBlogConfirm === blog.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleBlogDelete(blog.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Confirm</button>
                                                        <button onClick={() => setDeleteBlogConfirm(null)} className="text-xs bg-gray-100 text-accent-gray px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setDeleteBlogConfirm(blog.id)} className="p-2.5 rounded-xl text-accent-gray/40 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ═══════════════ RESEARCH TAB ═══════════════ */}
                {activeTab === "research" && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                <p className="text-3xl font-bold text-accent">{research.length}</p>
                                <p className="text-xs text-accent-gray/60 uppercase tracking-wider mt-1">Total Papers</p>
                            </div>
                            <Link href="/blog" target="_blank" rel="noopener noreferrer"
                                className="bg-accent text-white rounded-2xl p-5 hover:bg-accent/90 transition-colors flex items-center gap-3">
                                <Eye className="w-6 h-6" />
                                <div><p className="font-semibold text-sm">View Public Page</p><p className="text-xs text-white/60">Blog & Research</p></div>
                            </Link>
                            <button onClick={() => { setEditingResearch(null); setResearchForm(EMPTY_RESEARCH); setShowResearchForm(true); }}
                                className="bg-primary text-white rounded-2xl p-5 hover:bg-primary/90 transition-colors flex items-center gap-3">
                                <Plus className="w-6 h-6" />
                                <div className="text-left"><p className="font-semibold text-sm">New Paper</p><p className="text-xs text-white/60">Add publication</p></div>
                            </button>
                        </div>

                        {/* Research List */}
                        {researchLoading ? (
                            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : research.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <GraduationCap className="w-12 h-12 text-accent-gray/30 mx-auto mb-4" />
                                <p className="text-accent-gray/60">No research papers yet. Add your first one!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {research.map((paper, index) => (
                                    <motion.div key={paper.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full text-accent-gray">{paper.year}</span>
                                                    {paper.link && paper.link !== "#" && (
                                                        <a href={paper.link} target="_blank" rel="noopener noreferrer"
                                                            className="text-xs text-primary hover:underline flex items-center gap-1">
                                                            <ExternalLink className="w-3 h-3" /> View Paper
                                                        </a>
                                                    )}
                                                </div>
                                                <h3 className="font-serif text-lg font-bold text-accent truncate group-hover:text-primary transition-colors">{paper.title}</h3>
                                                <p className="text-sm text-accent-gray/60 mt-1 line-clamp-2">{paper.abstract}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button onClick={() => { setEditingResearch(paper); setResearchForm({ ...paper }); setShowResearchForm(true); }}
                                                    className="p-2.5 rounded-xl text-accent-gray/40 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {deleteResearchConfirm === paper.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleResearchDelete(paper.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Confirm</button>
                                                        <button onClick={() => setDeleteResearchConfirm(null)} className="text-xs bg-gray-100 text-accent-gray px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setDeleteResearchConfirm(paper.id)} className="p-2.5 rounded-xl text-accent-gray/40 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ═══════════════ BOOKINGS TAB ═══════════════ */}
                {activeTab === "bookings" && (
                    <>
                        {/* Stats & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <p className="text-3xl font-bold text-accent">{bookings.length}</p>
                                    <p className="text-xs text-accent-gray/60 uppercase tracking-wider mt-1">Total</p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <p className="text-3xl font-bold text-primary">
                                        {bookings.filter(b => b.patientType === "new").length}
                                    </p>
                                    <p className="text-xs text-accent-gray/60 uppercase tracking-wider mt-1">New Patients</p>
                                </div>
                            </div>
                            <button onClick={() => setShowManualBooking(true)}
                                className="bg-accent text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:bg-accent/90 transition-all flex items-center gap-2 h-fit shrink-0">
                                <Plus className="w-5 h-5" /> Add Booking
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {["all", "new", "completed"].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setBookingFilter(filter as any)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${bookingFilter === filter
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white text-accent-gray hover:bg-gray-50 border border-gray-100"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Booking List */}
                        {bookingLoading ? (
                            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Calendar className="w-12 h-12 text-accent-gray/30 mx-auto mb-4" />
                                <p className="text-accent-gray/60">No bookings found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {bookings
                                    .filter(b => bookingFilter === "all" ? true : b.status === bookingFilter)
                                    .map((booking, index) => (
                                        <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all">
                                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                {/* Patient Info */}
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-accent">{booking.name}</h3>
                                                        <div className="flex gap-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${booking.patientType === "new" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                                                {booking.patientType === "new" ? "New" : "Return"}
                                                            </span>
                                                            {booking.status === "new" && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">New</span>}
                                                            {booking.status === "completed" && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-100 text-green-700">Done</span>}
                                                        </div>
                                                        <span className="text-xs text-accent-gray/40">{new Date(booking.timestamp || Date.now()).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-accent-gray">
                                                        <p className="flex items-center gap-2"><span className="font-semibold text-accent w-16">Email:</span> {booking.email}</p>
                                                        <p className="flex items-center gap-2"><span className="font-semibold text-accent w-16">Phone:</span> {booking.phone}</p>
                                                        <p className="flex items-center gap-2"><span className="font-semibold text-accent w-16">Type:</span> {booking.appointmentType || "Not specified"}</p>
                                                        <p className="flex items-center gap-2"><span className="font-semibold text-accent w-16">Time:</span> {booking.preferredDay} - {booking.preferredTime}</p>
                                                    </div>
                                                    {booking.reason && (
                                                        <div className="mt-4 bg-secondary/30 p-3 rounded-xl">
                                                            <p className="text-xs font-bold text-accent uppercase mb-1">Reason for Visit</p>
                                                            <p className="text-sm text-accent-gray italic">&quot;{booking.reason}&quot;</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 shrink-0 min-w-[140px]">
                                                    {deleteBookingConfirm === booking.id ? (
                                                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                                                            <span className="text-xs text-red-500 font-medium text-center">Delete request?</span>
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => setDeleteBookingConfirm(null)} className="text-xs bg-gray-100 text-accent-gray px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                                                                <button onClick={() => handleBookingDelete(booking.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Confirm</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2 lg:flex-col items-end w-full justify-end">
                                                            {booking.status !== "completed" ? (
                                                                <button onClick={() => handleBookingStatusUpdate(booking.id, "completed")}
                                                                    className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors w-full justify-end">
                                                                    <Check className="w-4 h-4" /> <span className="hidden lg:inline">Complete</span>
                                                                </button>
                                                            ) : (
                                                                <button disabled className="flex items-center gap-2 text-sm font-semibold text-gray-400 px-3 py-2 rounded-lg w-full justify-end opacity-50 cursor-not-allowed">
                                                                    <Check className="w-4 h-4" /> <span className="hidden lg:inline">Done</span>
                                                                </button>
                                                            )}

                                                            <button onClick={() => { setEditingBooking(booking); setShowManualBooking(true); }}
                                                                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-full justify-end">
                                                                <Pencil className="w-4 h-4" /> <span className="hidden lg:inline">Edit</span>
                                                            </button>

                                                            <button onClick={() => setDeleteBookingConfirm(booking.id)}
                                                                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors w-full justify-end">
                                                                <Trash2 className="w-4 h-4" /> <span className="hidden lg:inline">Delete</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        )}
                    </>
                )}


            </div>


            {/* ═══════════════ MANUAL BOOKING MODAL ═══════════════ */}
            <AnimatePresence>
                {
                    showManualBooking && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto py-8 px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowManualBooking(false)}
                                className="fixed inset-0 bg-accent/50 backdrop-blur-sm" />

                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden">

                                <div className="bg-accent px-6 py-4 md:px-8 md:py-6 flex items-center justify-between">
                                    <h2 className="font-serif text-xl font-bold text-white">{editingBooking ? "Edit Booking" : "Add Booking"}</h2>
                                    <button onClick={() => { setShowManualBooking(false); setEditingBooking(null); }} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                                </div>

                                <form onSubmit={handleManualBookingSubmit} className="p-6 md:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-accent mb-1">Patient Name</label>
                                            <input name="name" defaultValue={editingBooking?.name} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-accent mb-1">Phone</label>
                                            <input name="phone" defaultValue={editingBooking?.phone} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-accent mb-1">Email</label>
                                            <input name="email" type="email" defaultValue={editingBooking?.email} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-accent mb-1">Type</label>
                                            <select name="patientType" defaultValue={editingBooking?.patientType} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none">
                                                <option value="new">New Patient</option>
                                                <option value="returning">Returning</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-accent mb-1">Service</label>
                                            <select name="appointmentType" defaultValue={editingBooking?.appointmentType} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none">
                                                <option value="Initial Consultation">Initial Consultation</option>
                                                <option value="Follow-up Appointment">Follow-up Appointment</option>
                                                <option value="Obstetrics Check-up">Obstetrics Check-up</option>
                                                <option value="Gynaecology Review">Gynaecology Review</option>
                                                <option value="Fertility Consultation">Fertility Consultation</option>
                                                <option value="Procedure / Surgery">Procedure / Surgery</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-accent mb-1">Preferred Day</label>
                                            <input name="preferredDay" type="date" defaultValue={editingBooking?.preferredDay} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-accent mb-1">Preferred Time</label>
                                            <select name="preferredTime" defaultValue={editingBooking?.preferredTime} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none">
                                                <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                                                <option value="Afternoon (12pm - 3pm)">Afternoon (12pm - 3pm)</option>
                                                <option value="Late Afternoon (3pm - 5pm)">Late Afternoon (3pm - 5pm)</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-accent mb-1">Reason / Notes</label>
                                            <textarea name="reason" defaultValue={editingBooking?.reason} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition-all">
                                        {editingBooking ? "Update Booking" : "Save Booking"}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >


            {/* ═══════════════ BLOG FORM MODAL ═══════════════ */}
            <AnimatePresence>
                {
                    showBlogForm && (
                        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-8 px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => { setShowBlogForm(false); setEditingBlog(null); setImagePreview(""); }}
                                className="fixed inset-0 bg-accent/50 backdrop-blur-sm" />

                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl z-10">

                                {/* Header */}
                                <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 py-4 md:px-8 md:py-5 flex items-center justify-between z-20">
                                    <h2 className="font-serif text-2xl font-bold text-accent">{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</h2>
                                    <button onClick={() => { setShowBlogForm(false); setEditingBlog(null); setImagePreview(""); }}
                                        className="p-2 rounded-xl hover:bg-gray-100 text-accent-gray/60 transition-colors"><X className="w-5 h-5" /></button>
                                </div>

                                <form onSubmit={handleBlogSubmit} className="p-6 md:p-8 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><FileText className="w-4 h-4 text-primary" /> Blog Title</label>
                                        <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                            placeholder="e.g., Understanding Endometriosis: Symptoms and Treatment"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent" required />
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><AlignLeft className="w-4 h-4 text-primary" /> Excerpt / Summary</label>
                                        <textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                            placeholder="A brief summary that appears on the blog listing page..."
                                            rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent resize-none" required />
                                    </div>

                                    {/* Category + Date */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Custom Category Combo */}
                                        <div className="relative">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><Tag className="w-4 h-4 text-primary" /> Category</label>
                                            <input
                                                type="text"
                                                value={blogForm.category}
                                                onChange={(e) => {
                                                    setBlogForm({ ...blogForm, category: e.target.value });
                                                    setCustomCategory(e.target.value);
                                                    setShowCategoryDropdown(true);
                                                }}
                                                onFocus={() => setShowCategoryDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                                                placeholder="Select or type new category..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent"
                                                required
                                            />
                                            {/* Dropdown */}
                                            {showCategoryDropdown && filteredCategoryOptions.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                                                    {filteredCategoryOptions.map(cat => (
                                                        <button key={cat} type="button" onClick={() => selectCategory(cat)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-accent hover:bg-primary/5 hover:text-primary transition-colors first:rounded-t-xl last:rounded-b-xl">
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><Calendar className="w-4 h-4 text-primary" /> Date (optional)</label>
                                            <input type="text" value={blogForm.date} onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                                                placeholder="e.g., February 15, 2026 (auto if empty)"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent" />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><ImageIcon className="w-4 h-4 text-primary" /> Blog Image</label>
                                        <div className="space-y-3">
                                            {/* Upload Button */}
                                            <div className="flex items-center gap-3">
                                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-sm text-accent-gray/60 hover:text-primary transition-all disabled:opacity-50">
                                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                    {uploading ? "Uploading..." : "Upload Image"}
                                                </button>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                <span className="text-xs text-accent-gray/40">or</span>
                                                <input type="text" value={blogForm.image} onChange={(e) => { setBlogForm({ ...blogForm, image: e.target.value }); setImagePreview(e.target.value); }}
                                                    placeholder="Paste image URL..."
                                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent text-sm" />
                                            </div>
                                            {/* Image Preview */}
                                            {(imagePreview || blogForm.image) && (
                                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={imagePreview || blogForm.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                    <button type="button" onClick={() => { setBlogForm({ ...blogForm, image: "" }); setImagePreview(""); }}
                                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg hover:bg-red-50 text-accent-gray/60 hover:text-red-500 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><BookOpen className="w-4 h-4 text-primary" /> Blog Content (Markdown)</label>
                                        <p className="text-xs text-accent-gray/50 mb-2">Use ### for headings, **text** for bold, - for bullet points.</p>
                                        <textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                            placeholder={"### Introduction\nWrite your blog content here using markdown...\n\n### Key Points\n- Point one\n- Point two\n\n**Important:** Bold text for emphasis."}
                                            rows={16} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent font-mono text-sm resize-y leading-relaxed" required />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button type="button" onClick={() => { setShowBlogForm(false); setEditingBlog(null); setImagePreview(""); }}
                                            className="px-5 py-2.5 rounded-xl text-accent-gray/60 hover:text-accent hover:bg-gray-100 transition-all font-medium text-sm">Cancel</button>
                                        <button type="submit" disabled={blogSaving}
                                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                                            {blogSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {editingBlog ? "Update Post" : "Publish Post"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >

            {/* ═══════════════ RESEARCH FORM MODAL ═══════════════ */}
            <AnimatePresence>
                {
                    showResearchForm && (
                        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-8 px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => { setShowResearchForm(false); setEditingResearch(null); }}
                                className="fixed inset-0 bg-accent/50 backdrop-blur-sm" />

                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-10">

                                <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 py-4 md:px-8 md:py-5 flex items-center justify-between z-20">
                                    <h2 className="font-serif text-2xl font-bold text-accent">{editingResearch ? "Edit Research Paper" : "Add Research Paper"}</h2>
                                    <button onClick={() => { setShowResearchForm(false); setEditingResearch(null); }}
                                        className="p-2 rounded-xl hover:bg-gray-100 text-accent-gray/60 transition-colors"><X className="w-5 h-5" /></button>
                                </div>

                                <form onSubmit={handleResearchSubmit} className="p-6 md:p-8 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><FileText className="w-4 h-4 text-primary" /> Paper Title</label>
                                        <input type="text" value={researchForm.title} onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                                            placeholder="e.g., Advanced Sonography in Fetal Cardiac Assessment"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent" required />
                                    </div>

                                    {/* Abstract */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><AlignLeft className="w-4 h-4 text-primary" /> Abstract</label>
                                        <textarea value={researchForm.abstract} onChange={(e) => setResearchForm({ ...researchForm, abstract: e.target.value })}
                                            placeholder="Brief description of the research..."
                                            rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent resize-none" required />
                                    </div>

                                    {/* Year + Link */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><Calendar className="w-4 h-4 text-primary" /> Year</label>
                                            <input type="text" value={researchForm.year} onChange={(e) => setResearchForm({ ...researchForm, year: e.target.value })}
                                                placeholder="e.g., 2025"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent" required />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-accent mb-2"><ExternalLink className="w-4 h-4 text-primary" /> Paper Link</label>
                                            <input type="text" value={researchForm.link} onChange={(e) => setResearchForm({ ...researchForm, link: e.target.value })}
                                                placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-accent" />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button type="button" onClick={() => { setShowResearchForm(false); setEditingResearch(null); }}
                                            className="px-5 py-2.5 rounded-xl text-accent-gray/60 hover:text-accent hover:bg-gray-100 transition-all font-medium text-sm">Cancel</button>
                                        <button type="submit" disabled={researchSaving}
                                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                                            {researchSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {editingResearch ? "Update Paper" : "Add Paper"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >
        </main >
    );
}
