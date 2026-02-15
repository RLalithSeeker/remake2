import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail, getAdminNotificationTemplate, getUserConfirmationTemplate } from "@/lib/email";

const BOOKINGS_FILE = path.join(process.cwd(), "src", "data", "bookings.json");

function readBookings() {
    try {
        if (!fs.existsSync(BOOKINGS_FILE)) {
            fs.writeFileSync(BOOKINGS_FILE, "[]", "utf-8");
        }
        const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeBookings(bookings: unknown[]) {
    try {
        // Ensure directory exists
        const dir = path.dirname(BOOKINGS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to write bookings:", e);
    }
}

export async function GET() {
    try {
        const bookings = readBookings();
        // Sort by newest first
        bookings.sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp);
        return NextResponse.json(bookings);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name, email, phone,
            patientType, appointmentType,
            preferredDay, preferredTime,
            reason
        } = body;

        // Simple validation
        if (!name || !email || !phone || !patientType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const bookings = readBookings();
        const newBooking = {
            id: Date.now(),
            timestamp: Date.now(),
            date: new Date().toLocaleDateString(),
            name,
            email,
            phone,
            patientType,
            appointmentType,
            preferredDay,
            preferredTime,
            reason,
            status: "new"
        };

        bookings.unshift(newBooking);
        writeBookings(bookings);

        // Send Email Notifications
        try {
            // 1. Notify Admin
            await sendEmail({
                to: "admin@example.com", // Replace with actual admin email or env var
                subject: "New Appointment Request",
                html: getAdminNotificationTemplate(newBooking)
            });

            // 2. Confirm to User
            if (email) {
                await sendEmail({
                    to: email,
                    subject: "Appointment Request Received",
                    html: getUserConfirmationTemplate(name)
                });
            }
        } catch (error) {
            console.error("Failed to send emails:", error);
            // Don't fail the request, just log the error
        }

        return NextResponse.json(
            { message: "Booking request received successfully", id: newBooking.id },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
