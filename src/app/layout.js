import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "TicketBari - Online Ticket Booking Platform",
  description: "Book bus, train, launch & flight tickets easily online",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-(--background) text-(--foreground) font-sans antialiased selection:bg-violet-200 selection:text-violet-900 transition-colors duration-300">
        <AppProvider>
          <Navbar />
          <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <ToastProvider />
        </AppProvider>
      </body>
    </html>
  );
}
