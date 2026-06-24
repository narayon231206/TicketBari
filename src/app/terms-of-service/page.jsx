import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <Link href="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-violet-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-(--foreground)">Terms of Service</h1>
        <p className="text-sm text-(--muted)">
          These Terms of Service govern your use of TicketBari and the services we provide for ticket booking and travel planning.
        </p>
      </div>

      <div className="space-y-6 rounded-3xl border border-(--card-border) bg-(--card-bg) p-6 shadow-sm">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">1. Acceptance of Terms</h2>
          <p className="text-sm leading-7 text-(--muted)">
            By using TicketBari, you agree to follow these Terms of Service and all applicable local laws and regulations. If you do not agree, please stop using our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">2. Account Responsibility</h2>
          <p className="text-sm leading-7 text-(--muted)">
            You are responsible for keeping your account credentials secure and for all activity performed under your account. Please notify us immediately if you believe your account has been compromised.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">3. Booking and Payment</h2>
          <p className="text-sm leading-7 text-(--muted)">
            Ticket booking requests are subject to availability, verification, and approval by the relevant service provider. Payments made through our platform are processed securely, and you are responsible for providing accurate booking details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">4. Cancellations and Refunds</h2>
          <p className="text-sm leading-7 text-(--muted)">
            Cancellation and refund policies depend on the ticket provider and the booking status. Please review your booking details carefully before making confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">5. Limitation of Liability</h2>
          <p className="text-sm leading-7 text-(--muted)">
            TicketBari is not responsible for delays, cancellations, or service issues caused by third-party transport providers, force majeure events, or circumstances beyond our reasonable control.
          </p>
        </section>
      </div>
    </div>
  );
}
