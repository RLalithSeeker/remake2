export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    // For now, log to console as a mock service.
    // In production, integrate with Resend or similar.
    console.log(`[EMAIL SERVICE] Sending to: ${to}`);
    console.log(`[EMAIL SERVICE] Subject: ${subject}`);
    console.log(`[EMAIL SERVICE] Body Length: ${html.length} chars`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
}

export function getAdminNotificationTemplate(booking: any) {
    return `
        <h1>New Appointment Request</h1>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Email:</strong> ${booking.email || "N/A"}</p>
        <p><strong>Type:</strong> ${booking.patientType}</p>
        <p><strong>Service:</strong> ${booking.appointmentType}</p>
        <p><strong>Preferred:</strong> ${booking.preferredDay} - ${booking.preferredTime}</p>
        <p><strong>Reason:</strong> ${booking.reason || "N/A"}</p>
    `;
}

export function getUserConfirmationTemplate(name: string) {
    return `
        <h1>Appointment Request Received</h1>
        <p>Dear ${name},</p>
        <p>Thank you for contacting us. We have received your appointment request and will be in touch shortly to confirm the details.</p>
        <p>Best regards,<br/>The Clinic Team</p>
    `;
}
