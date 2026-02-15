import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyankakarine.com.au";

interface Blog {
    id: number;
    title: string;
    date: string;
}

function getBlogs(): Blog[] {
    try {
        const filePath = path.join(process.cwd(), "src", "data", "blogs.json");
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const blogs = getBlogs();

    const blogEntries = blogs.map((blog) => ({
        url: `${SITE_URL}/blog/${blog.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...blogEntries,
    ];
}
