import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESEARCH_FILE = path.join(process.cwd(), "src", "data", "research.json");

function readResearch() {
    const data = fs.readFileSync(RESEARCH_FILE, "utf-8");
    return JSON.parse(data);
}

function writeResearch(papers: unknown[]) {
    fs.writeFileSync(RESEARCH_FILE, JSON.stringify(papers, null, 2), "utf-8");
}

export async function GET() {
    try {
        const papers = readResearch();
        return NextResponse.json(papers);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const papers = readResearch();
        const newPaper = await request.json();

        const maxId = papers.reduce((max: number, p: { id: number }) => Math.max(max, p.id), 0);
        newPaper.id = maxId + 1;

        papers.unshift(newPaper);
        writeResearch(papers);

        return NextResponse.json(newPaper, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create paper." }, { status: 500 });
    }
}
