import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BOOKINGS_FILE = path.join(process.cwd(), "src", "data", "bookings.json");

function readBookings() {
    try {
        if (!fs.existsSync(BOOKINGS_FILE)) return [];
        const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeBookings(bookings: unknown[]) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const bookings = readBookings();
        const idToDelete = parseInt(params.id);
        const filtered = bookings.filter((b: { id: number }) => b.id !== idToDelete);

        if (filtered.length === bookings.length) {
            return NextResponse.json({ error: "Booking not found." }, { status: 404 });
        }

        writeBookings(filtered);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const bookings = readBookings();
        const idToUpdate = parseInt(params.id);
        const bookingIndex = bookings.findIndex((b: { id: number }) => b.id === idToUpdate);

        if (bookingIndex === -1) {
            return NextResponse.json({ error: "Booking not found." }, { status: 404 });
        }

        bookings[bookingIndex] = { ...bookings[bookingIndex], ...body };
        writeBookings(bookings);

        return NextResponse.json({ success: true, booking: bookings[bookingIndex] });
    } catch {
        return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
    }
}
