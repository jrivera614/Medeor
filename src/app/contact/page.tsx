import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact & Feedback | Medeor",
  description: "Report content errors, request features, or provide feedback for the Medeor TCCC training platform.",
  alternates: { canonical: "https://medeor.app/contact" },
};

export default function ContactPage() { return <ContactClient />; }
