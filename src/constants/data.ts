export const SITE_DATA = {
    general: {
        siteName: "Dr. Priyanka Karine",
        phone: "+61 400 000 000", // Placeholder if not found, or leave generic
        email: "reception@drpriyankakarine.com.au", // Inferred or generic
        address: "Specilist Obstetrician and Gynaecologist | Sydney",
        bookingLink: "https://drpriyankakarine.com.au/appointments/",
    },
    hero: {
        headline: "Expertise with heart.",
        subheadline: "Dedicated to providing holistic, evidence-based care for women in Sydney. From preconception to postpartum and beyond, every woman deserves to feel heard, understood, and supported.",
        primaryButton: "Book Consultation",
        secondaryButton: "View Services",
    },
    affiliations: [
        { name: "South Western Sydney Local Health District", logo: null, color: "text-red-700" },
        { name: "ASUM", logo: null, color: "text-blue-600" },
        { name: "RANZCOG", logo: null, color: "text-purple-700" },
        { name: "ISUOG", logo: null, color: "text-red-500" },
    ],
    navigation: [
        { label: "Home", href: "/" },
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Locations", href: "#locations" },
        { label: "Contact", href: "#contact" },
    ],
    services: [
        {
            id: "obstetrics",
            iconKey: "PregnantIcon",
            title: "Obstetric Services",
            description: "Specialised care from preconception to postpartum, including support for habitual miscarriage and high-risk pregnancies.",
            features: [
                "Recurrent miscarriage or history of pregnancy loss",
                "Preconception counselling",
                "Diabetes and hypertension in pregnancy",
                "Thyroid disorders in pregnancy",
                "Autoimmune conditions in pregnancy",
                "Fetal growth concerns",
                "Twin pregnancies"
            ]
        },
        {
            id: "imaging",
            iconKey: "ScopeIcon",
            title: "Imaging Services",
            description: "Safe and trusted ultrasound services providing clear diagnostics and gentle care throughout all stages.",
            features: [
                "Early pregnancy scans, early morphology",
                "NIPT counselling",
                "Routine morphology and growth scans",
                "Cervical length assessment",
                "Pelvic ultrasound",
                "Tubal patency and uterine abnormality assessment (HyCoSy, Sonohysterogram)"
            ]
        },
        {
            id: "gynaecology",
            iconKey: "UterusIcon",
            title: "Gynaecological Health Care",
            description: "Comprehensive management of women's health from routine check-ups to complex conditions.",
            features: [
                "Heavy, painful, or irregular periods",
                "Polycystic Ovarian Syndrome (PCOS)",
                "Endometriosis",
                "Ovarian cyst management",
                "Cervical screening and colposcopy",
                "Contraception counselling (Implanon, IUD)",
                "Laparoscopic salpingectomy/tubal ligation"
            ]
        },
    ],
    locations: [
        {
            name: "Bella Vista",
            detail: "Consulting Rooms (Obstetrics & Gynaecology)",
            timing: "Mon - Fri: 9:00 AM - 5:00 PM",
        },
        {
            name: "Liverpool Hospital",
            detail: "Visiting Medical Officer with admitting rights.",
            timing: "By Appointment Only",
        },
        {
            name: "Norwest Private Hospital",
            detail: "Obstetric and Gynaecological services.",
            timing: "Mon, Wed, Fri: 8:00 AM - 6:00 PM",
        },
        {
            name: "Wentworthville",
            detail: "Weekend obstetric & gynaecological consultation.",
            timing: "Saturday: 9:00 AM - 1:00 PM",
        },
        {
            name: "Westmead",
            detail: "Centre for Women’s Ultrasound & Westmead Private Hospital.",
            timing: "Tue & Wed: 9:00 AM - 5:00 PM",
        },
    ],
    faq: [
        {
            question: "Do I need a referral?",
            answer: "No referral is necessary to book an appointment. You can schedule immediately and bring your GP referral on the day."
        },
        {
            question: "What private health funds do you accept?",
            answer: "We work with all major private health funds in Australia. Our team can assist you with coverage checks and expense estimation prior to your procedure."
        },
        {
            question: "Do you offer telehealth consultations?",
            answer: "Yes, telehealth appointments are available for initial consultations and follow-up reviews, providing convenience for patients with busy schedules or those living remotely."
        },
        {
            question: "Is parking available at the clinics?",
            answer: "Yes, all our consulting locations at Bella Vista, Liverpool, and Westmead have convenient on-site or nearby parking facilities for patients."
        },
        {
            question: "What languages does Dr. Priyanka speak?",
            answer: "Dr. Priyanka is fluent in English, Hindi, Telugu, Gujarati, and Marathi, ensuring clear communication and cultural comfort for diverse communities."
        },
        {
            question: "What is considered a high-risk pregnancy?",
            answer: "A pregnancy may be considered high-risk due to pre-existing medical conditions (like diabetes or hypertension), maternal age, multiple gestation (twins), or complications arising during pregnancy. We provide specialized monitoring for these cases."
        },
        {
            question: "Are ultrasounds Safe?",
            answer: "Yes, diagnostic ultrasound has been used for decades and is considered safe for both mother and baby. It uses sound waves, not radiation, to produce images."
        },
        {
            question: "What is the difference between Obstetrics and Gynaecology?",
            answer: "Obstetrics focuses on care during pregnancy, childbirth, and the postpartum period. Gynaecology deals with the general health of the female reproductive system outside of pregnancy."
        }
    ],
    footer: {
        quickLinksLabel: "Discover",
        contactLabel: "Get in Touch",
        copyright: "© 2026 Dr Priyanka Karine. All rights reserved.",
        acknowledgement: "We respectfully acknowledge the trust placed in us by our community, striving for excellence in every interaction.",
    },
};
