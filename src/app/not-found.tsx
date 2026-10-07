"use client";
import Link from "next/link";
import { useHealth } from "@/components/provider";
import { LanguageSwitch } from "@/components/ui";
export default function NotFound() {
  const { t } = useHealth();
  return (
    <main className="not-found">
      <div className="logo">nira.</div>
      <h1>
        {t("This chapter isn’t here yet.", "এই অধ্যায়টি এখনো তৈরি হয়নি।")}
      </h1>
      <p lang="bn">এই পৃষ্ঠাটি এখনো তৈরি হয়নি।</p>
      <Link href="/dashboard" className="button button-primary">
        {t("Back to your medical memory", "আপনার স্বাস্থ্য স্মৃতিতে ফিরুন")} →
      </Link>
      <LanguageSwitch />
    </main>
  );
}
