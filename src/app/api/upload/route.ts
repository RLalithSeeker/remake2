import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Ensure upload directory exists
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        // Validate it's an image
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const safeName = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .substring(0, 50);
        const fileName = `${safeName}-${timestamp}.${ext}`;

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(UPLOAD_DIR, fileName);
        fs.writeFileSync(filePath, buffer);

        // Return the public URL path
        return NextResponse.json({
            success: true,
            path: `/uploads/${fileName}`,
            fileName,
        });
    } catch {
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
