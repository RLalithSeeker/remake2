import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const papers = readResearch();
        const paper = papers.find((p: { id: number }) => p.id === parseInt(params.id));
        if (!paper) {
            return NextResponse.json({ error: "Paper not found." }, { status: 404 });
        }
        return NextResponse.json(paper);
    } catch {
        return NextResponse.json({ error: "Failed to read papers." }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const papers = readResearch();
        const index = papers.findIndex((p: { id: number }) => p.id === parseInt(params.id));
        if (index === -1) {
            return NextResponse.json({ error: "Paper not found." }, { status: 404 });
        }

        const updates = await request.json();
        papers[index] = { ...papers[index], ...updates, id: papers[index].id };
        writeResearch(papers);

        return NextResponse.json(papers[index]);
    } catch {
        return NextResponse.json({ error: "Failed to update paper." }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const papers = readResearch();
        const filtered = papers.filter((p: { id: number }) => p.id !== parseInt(params.id));
        if (filtered.length === papers.length) {
            return NextResponse.json({ error: "Paper not found." }, { status: 404 });
        }

        writeResearch(filtered);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete paper." }, { status: 500 });
    }
}
