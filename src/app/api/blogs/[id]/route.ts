import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BLOGS_FILE = path.join(process.cwd(), "src", "data", "blogs.json");

function readBlogs() {
    const data = fs.readFileSync(BLOGS_FILE, "utf-8");
    return JSON.parse(data);
}

function writeBlogs(blogs: unknown[]) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf-8");
}

function isAuthorized(request: NextRequest): boolean {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

    const token = authHeader.split(" ")[1];
    try {
        const decoded = Buffer.from(token, "base64").toString("utf-8");
        const [password] = decoded.split(":");
        return password === process.env.ADMIN_PASSWORD;
    } catch {
        return false;
    }
}

// GET /api/blogs/[id] — public, returns a single blog
export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const blogs = readBlogs();
        const blog = blogs.find((b: { id: number }) => b.id === parseInt(params.id));

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch {
        return NextResponse.json({ error: "Failed to fetch blog." }, { status: 500 });
    }
}

// PUT /api/blogs/[id] — protected, updates a blog
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const blogs = readBlogs();
        const blogIndex = blogs.findIndex((b: { id: number }) => b.id === parseInt(params.id));

        if (blogIndex === -1) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const updates = await request.json();
        blogs[blogIndex] = { ...blogs[blogIndex], ...updates, id: blogs[blogIndex].id };
        writeBlogs(blogs);

        return NextResponse.json(blogs[blogIndex]);
    } catch {
        return NextResponse.json({ error: "Failed to update blog." }, { status: 500 });
    }
}

// DELETE /api/blogs/[id] — protected, deletes a blog
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const blogs = readBlogs();
        const filtered = blogs.filter((b: { id: number }) => b.id !== parseInt(params.id));

        if (filtered.length === blogs.length) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        writeBlogs(filtered);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete blog." }, { status: 500 });
    }
}
