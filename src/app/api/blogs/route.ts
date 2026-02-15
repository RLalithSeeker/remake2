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

// GET /api/blogs — public, returns all blogs
export async function GET() {
    try {
        const blogs = readBlogs();
        return NextResponse.json(blogs);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

// POST /api/blogs — protected, creates a new blog
export async function POST(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const blogs = readBlogs();
        const newBlog = await request.json();

        // Auto-increment ID
        const maxId = blogs.reduce((max: number, b: { id: number }) => Math.max(max, b.id), 0);
        newBlog.id = maxId + 1;

        // Set date if not provided
        if (!newBlog.date) {
            newBlog.date = new Date().toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }

        blogs.unshift(newBlog); // Add to beginning (newest first)
        writeBlogs(blogs);

        return NextResponse.json(newBlog, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create blog." }, { status: 500 });
    }
}
