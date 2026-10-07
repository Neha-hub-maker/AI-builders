import type { Metadata } from "next";
import { HealthProvider } from "@/components/provider";
import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/600.css";
import "@fontsource/google-sans/700.css";
import "@fontsource/noto-sans-bengali/400.css";
import "@fontsource/noto-sans-bengali/500.css";
import "@fontsource/noto-sans-bengali/600.css";
import "@fontsource/noto-sans-bengali/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nira — Your medical history, remembered forever",
    template: "%s · Nira",
  },
  description:
    "Your lifelong health story, connected. Nira brings your medical records together into an evidence-linked clinical memory. AI remembers. Doctors decide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HealthProvider>{children}</HealthProvider>
      </body>
    </html>
  );
}
