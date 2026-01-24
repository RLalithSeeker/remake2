export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Appointment {
    id: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    serviceId: string; // References IDs from SITE_DATA.services
    preferredDate: Date;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
}

export interface CreateAppointmentDTO {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    serviceId: string;
    preferredDate: string; // ISO string from frontend
    notes?: string;
}
