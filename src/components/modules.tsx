"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  FileText,
  Languages,
  Link2,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useHealth } from "./provider";
import {
  AiLabel,
  DocumentButton,
  HemoglobinChart,
  LanguageSwitch,
  ReviewNote,
  Tag,
} from "./ui";
import { formatDate } from "@/lib/records";

export function ModulePage({ module }: { module: string }) {
  const { t, records, language, downloadSummary } = useHealth();
  const [query, setQuery] = useState("");
  const titles: Record<string, [string, string, string, string]> = {
    documents: [
      "Your original documents",
      "আপনার মূল ডকুমেন্ট",
      "Every source, kept with its story.",
      "প্রতিটি উৎস, তার গল্পের সঙ্গে।",
    ],
    summary: [
      "The story so far",
      "এ পর্যন্ত আপনার গল্প",
      "A clear view of your medical memory, ready for doctor review.",
      "ডাক্তারের পর্যালোচনার জন্য আপনার স্বাস্থ্য স্মৃতির স্পষ্ট চিত্র।",
    ],
    trends: [
      "A little more perspective",
      "আরও একটু বিস্তারিত",
      "Patterns across time, connected to the evidence.",
      "সময়ের প্রবণতা, প্রমাণের সঙ্গে সংযুক্ত।",
    ],
    "doctor-access": [
      "Your story. Your permission.",
      "আপনার গল্প। আপনার অনুমতি।",
      "The foundation for patient-controlled clinical access.",
      "রোগীর নিয়ন্ত্রিত ক্লিনিক্যাল অ্যাক্সেসের ভিত্তি।",
    ],
    settings: [
      "Make yourself at home",
      "আপনার মতো করে সাজান",
      "A few preferences for your personal workspace.",
      "আপনার ব্যক্তিগত ওয়ার্কস্পেসের পছন্দ।",
    ],
  };
  const title = titles[module];
  return (
    <div className="module-page page-enter">
      <div className="page-heading">
        <div>
          <div className="page-overline">
            <span className="status-dot" />
            NIRA ·{" "}
            {t("YOUR PERSONAL WORKSPACE", "আপনার ব্যক্তিগত ওয়ার্কস্পেস")}
          </div>
          <h1>{t(title[0], title[1])}</h1>
          <p>{t(title[2], title[3])}</p>
        </div>
        {module === "documents" ? (
          <Link href="/upload" className="button button-primary">
            <Plus size={16} />
            {t("Add a record", "রেকর্ড যোগ")}
          </Link>
        ) : module !== "settings" && module !== "doctor-access" ? (
          <button className="button button-primary" onClick={downloadSummary}>
            <ArrowDownToLine size={16} />
            {t("Download summary", "সারাংশ ডাউনলোড")}
          </button>
        ) : null}
      </div>
      {module === "documents" && (
        <section className="card documents-card">
          <div className="documents-toolbar">
            <span>
              {records.length} {t("connected documents", "সংযুক্ত ডকুমেন্ট")}
            </span>
            <label className="modal-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Find a document…", "ডকুমেন্ট খুঁজুন…")}
                aria-label={t("Find a document", "ডকুমেন্ট খুঁজুন")}
              />
            </label>
          </div>
          {records
            .filter((r) =>
              `${r.title} ${r.titleBn} ${r.fileName} ${r.provider}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((r) => (
              <div className="document-row" key={r.id}>
                <div className="document-icon">
                  <FileText size={20} />
                </div>
                <div>
                  <h3>{language === "bn" ? r.titleBn : r.title}</h3>
                  <p>
                    {r.fileName} · {formatDate(r.date, language, true)}
                  </p>
                </div>
                <Tag color={r.isUploaded ? "green" : "neutral"}>
                  {r.isUploaded
                    ? t("Local upload", "স্থানীয় আপলোড")
                    : t("Sample", "নমুনা")}
                </Tag>
                <DocumentButton record={r} />
              </div>
            ))}
          {!records.some((r) =>
            `${r.title} ${r.titleBn} ${r.fileName} ${r.provider}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ) && (
            <div className="empty-state">
              {t("No documents match your search.", "কোনো ডকুমেন্ট মেলেনি।")}
            </div>
          )}
        </section>
      )}
      {module === "summary" && (
        <section className="card summary-card">
          <AiLabel />
          <h2>
            {t(
              "8 years of context. One connected story.",
              "৮ বছরের তথ্য। একটি সংযুক্ত গল্প।",
            )}
          </h2>
          <p className="summary-intro">
            {t(
              "This sample workspace brings together historical investigations, a follow-up prescription, and a blood health trend. Uploaded records below contain patient-entered details.",
              "এই নমুনা ওয়ার্কস্পেস পুরোনো পরীক্ষা, ফলো-আপ প্রেসক্রিপশন ও রক্তের স্বাস্থ্য প্রবণতা একত্র করে। আপলোড করা রেকর্ডে রোগীর দেওয়া তথ্য রয়েছে।",
            )}
          </p>
          <Tag color="amber">
            {t(
              "For doctor review · Illustrative summary",
              "ডাক্তারের পর্যালোচনার জন্য · উদাহরণ সারাংশ",
            )}
          </Tag>
          <div className="summary-records">
            {[...records]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((r) => (
                <article key={r.id}>
                  <div>
                    <span className="overline">
                      {formatDate(r.date, language, true)}
                    </span>
                    <h3>{language === "bn" ? r.titleBn : r.title}</h3>
                    <p>{r.finding}</p>
                  </div>
                  <DocumentButton record={r} />
                </article>
              ))}
          </div>
          <ReviewNote />
        </section>
      )}
      {module === "trends" && (
        <div className="module-trend-grid">
          <section className="card module-chart">
            <AiLabel />
            <h2>{t("Hemoglobin over time", "সময়ের সঙ্গে হিমোগ্লোবিন")}</h2>
            <p>
              {t(
                "3 illustrative blood reports · 2026 · g/dL",
                "৩টি উদাহরণ রক্ত রিপোর্ট · ২০২৬ · g/dL",
              )}
            </p>
            <HemoglobinChart />
            <ReviewNote />
          </section>
          <section className="card module-trend-note">
            <Tag color="amber">{t("For review", "পর্যালোচনার জন্য")}</Tag>
            <h2>
              {t("A pattern, with context.", "একটি প্রবণতা, বিস্তারিত তথ্যসহ।")}
            </h2>
            <p>
              {t(
                "The sample results show a decrease from 13.4 to 11.2 g/dL. A doctor must interpret this alongside symptoms, reference ranges, and the complete history.",
                "নমুনা ফলাফলে ১৩.৪ থেকে ১১.২ g/dL হ্রাস দেখা যায়। ডাক্তার উপসর্গ, স্বাভাবিক সীমা ও সম্পূর্ণ ইতিহাসের সঙ্গে এটি মূল্যায়ন করবেন।",
              )}
            </p>
            <Link href="/timeline" className="button button-secondary">
              {t("Review source reports", "মূল রিপোর্ট দেখুন")}
              <ArrowUpRight size={15} />
            </Link>
            <p className="small muted">
              {t(
                "Chart uses the three seeded sample reports; uploaded values remain in your timeline.",
                "চার্টে তিনটি নমুনা রিপোর্ট দেখানো হয়েছে; আপলোডের তথ্য আপনার টাইমলাইনে থাকে।",
              )}
            </p>
          </section>
        </div>
      )}
      {module === "doctor-access" && (
        <section className="card access-foundation">
          <div className="access-illustration">
            <div>
              <Stethoscope size={35} />
            </div>
            <span>
              <LockKeyhole size={18} />
            </span>
          </div>
          <Tag color="blue">
            {t("NEXT CHAPTER · IN DEVELOPMENT", "পরের অধ্যায় · তৈরি হচ্ছে")}
          </Tag>
          <h2>
            {t(
              "Better care starts with the full picture.",
              "সম্পূর্ণ তথ্য থেকেই ভালো চিকিৎসা শুরু।",
            )}
          </h2>
          <p>
            {t(
              "Secure doctor invitations, time-limited access, and QR sharing are planned for the next release. No doctor has access to this local demo. For now, download your summary to bring to your appointment.",
              "নিরাপদ ডাক্তার আমন্ত্রণ, নির্দিষ্ট সময়ের অ্যাক্সেস ও QR শেয়ার পরের সংস্করণে আসবে। এই স্থানীয় ডেমোতে কোনো ডাক্তারের অ্যাক্সেস নেই। আপাতত অ্যাপয়েন্টমেন্টের জন্য সারাংশ ডাউনলোড করুন।",
            )}
          </p>
          <div className="access-principles">
            <span>
              <ShieldCheck size={16} />
              {t(
                "You approve every connection",
                "প্রতিটি সংযোগ আপনি অনুমোদন করেন",
              )}
            </span>
            <span>
              <Link2 size={16} />
              {t(
                "Original evidence travels with the context",
                "তথ্যের সঙ্গে মূল প্রমাণ থাকে",
              )}
            </span>
          </div>
          <button className="button button-primary" onClick={downloadSummary}>
            {t("Download my visit summary", "আমার ভিজিটের সারাংশ ডাউনলোড")}
            <ArrowDownToLine size={16} />
          </button>
        </section>
      )}
      {module === "settings" && (
        <section className="card settings-card">
          <div className="settings-row">
            <span className="overview-icon icon-teal">
              <Languages size={20} />
            </span>
            <div>
              <h3>{t("Your preferred language", "আপনার পছন্দের ভাষা")}</h3>
              <p>
                {t(
                  "English and Bangla, naturally together.",
                  "ইংরেজি ও বাংলা, স্বাভাবিকভাবে একসঙ্গে।",
                )}
              </p>
            </div>
            <LanguageSwitch />
          </div>
          <div className="settings-row">
            <span className="overview-icon icon-blue">
              <LockKeyhole size={20} />
            </span>
            <div>
              <h3>{t("Local data & privacy", "স্থানীয় তথ্য ও গোপনীয়তা")}</h3>
              <p>
                {t(
                  "Uploaded files and record details are stored in this browser only. No account or cloud backup is connected. Clearing site data removes your uploads.",
                  "আপলোড ও রেকর্ড শুধু এই ব্রাউজারে থাকে। কোনো অ্যাকাউন্ট বা ক্লাউড ব্যাকআপ সংযুক্ত নেই। সাইটের তথ্য মুছে দিলে আপলোড হারাবে।",
                )}
              </p>
            </div>
            <Tag>{t("Local only", "শুধু স্থানীয়")}</Tag>
          </div>
          <div className="settings-row">
            <span className="overview-icon icon-peach">
              <Bell size={20} />
            </span>
            <div>
              <h3>{t("Notifications", "বিজ্ঞপ্তি")}</h3>
              <p>
                {t(
                  "In-app demo updates only. Email, SMS, and clinical alerts are not connected.",
                  "শুধু অ্যাপের ডেমো আপডেট। ইমেইল, SMS ও ক্লিনিক্যাল অ্যালার্ট সংযুক্ত নয়।",
                )}
              </p>
            </div>
            <Tag color="neutral">{t("Demo", "ডেমো")}</Tag>
          </div>
        </section>
      )}
    </div>
  );
}
