import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;
        const assistantPassword = process.env.ASSISTANT_PASSWORD;

        if (!adminPassword || !assistantPassword) {
            return NextResponse.json(
                { error: "Auth configuration missing on server." },
                { status: 500 }
            );
        }

        let role = null;
        if (password === adminPassword) {
            role = "admin";
        } else if (password === assistantPassword) {
            role = "assistant";
        }

        if (!role) {
            return NextResponse.json(
                { error: "Invalid password." },
                { status: 401 }
            );
        }

        // Create a token that encodes the role: base64(role:timestamp)
        const token = Buffer.from(`${role}:${Date.now()}`).toString("base64");

        return NextResponse.json({ success: true, token, role });
    } catch {
        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}
