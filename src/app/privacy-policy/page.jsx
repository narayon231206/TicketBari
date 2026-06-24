import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <Link href="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-violet-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-(--foreground)">Privacy Policy</h1>
        <p className="text-sm text-(--muted)">
          This Privacy Policy explains how TicketBari collects, uses, protects, and shares your personal information when you use our website and services.
        </p>
      </div>

      <div className="space-y-6 rounded-3xl border border-(--card-border) bg-(--card-bg) p-6 shadow-sm">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">1. Information We Collect</h2>
          <p className="text-sm leading-7 text-(--muted)">
            When you register, book tickets, or contact us, we may collect your name, email address, phone number, payment details, travel preferences, and booking history. We also collect technical data such as IP address, browser type, and device information for security and service improvement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">2. How We Use Your Information</h2>
          <p className="text-sm leading-7 text-(--muted)">
            We use your information to create and manage your account, process bookings, confirm payments, send booking updates, improve user experience, prevent fraud, and provide support when needed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">3. Data Security</h2>
          <p className="text-sm leading-7 text-(--muted)">
            We take reasonable steps to protect your personal information using secure systems and access controls. However, no online platform can guarantee absolute security, so we encourage users to keep their passwords safe.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">4. Sharing of Information</h2>
          <p className="text-sm leading-7 text-(--muted)">
            We do not sell your personal information to third parties. We may share limited information with payment providers, service partners, or legal authorities when required for booking processing, fraud prevention, or compliance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-(--foreground)">5. Your Rights</h2>
          <p className="text-sm leading-7 text-(--muted)">
            You may request access, correction, or deletion of your personal data, subject to applicable laws and platform policies. Please contact our support team for any such request.
          </p>
        </section>
      </div>
    </div>
  );
}
