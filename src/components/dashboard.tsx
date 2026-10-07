"use client";

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  FileText,
  Heart,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useHealth } from "./provider";
import {
  AiLabel,
  DocumentButton,
  HemoglobinChart,
  ReviewNote,
  Tag,
} from "./ui";
import { formatDate } from "@/lib/records";

export function Dashboard() {
  const { t, language, records, downloadSummary } = useHealth();
  const latest = [...records]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  return (
    <div className="dashboard-page page-enter">
      <div className="page-heading">
        <div>
          <div className="page-overline">
            <span className="status-dot" />
            {t("YOUR HEALTH, IN PERSPECTIVE", "আপনার স্বাস্থ্য, এক নজরে")}
          </div>
          <h1>
            {t("Good evening,", "শুভ সন্ধ্যা,")} Rakib{" "}
            <span className="greeting-sun" aria-hidden="true">
              ☀
            </span>
          </h1>
          <p>
            {t(
              "A little clarity. A more connected health journey.",
              "একটু স্পষ্টতা। আরও সংযুক্ত স্বাস্থ্যযাত্রা।",
            )}
          </p>
        </div>
        <Link className="button button-primary" href="/upload">
          <Plus size={17} />
          {t("Upload records", "রেকর্ড আপলোড")}
        </Link>
      </div>
      <section className="memory-banner">
        <div className="banner-orbit" />
        <div className="banner-content">
          <div className="banner-status">
            <span className="status-dot" />
            {t(
              "YOUR MEDICAL MEMORY IS UPDATED",
              "আপনার স্বাস্থ্য স্মৃতি আপডেট হয়েছে",
            )}
          </div>
          <h2>
            {t("Your whole story.", "আপনার সম্পূর্ণ গল্প।")}
            <br />
            <span>{t("Together, at last.", "অবশেষে, একসঙ্গে।")}</span>
          </h2>
          <p lang="bn">আপনার আজীবনের স্বাস্থ্য স্মৃতি, এখন এক জায়গায়।</p>
          <Link href="/timeline" className="text-link">
            {t(
              "Explore your medical timeline",
              "আপনার মেডিক্যাল টাইমলাইন দেখুন",
            )}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="banner-visual">
          <div className="banner-ring ring-one" />
          <div className="banner-ring ring-two" />
          <div className="banner-core">
            <Activity size={40} strokeWidth={1.7} />
          </div>
          <div className="banner-chip chip-records">
            <FileText size={16} />
            <span>
              <strong>{records.length}</strong>{" "}
              {t("connected records", "সংযুক্ত রেকর্ড")}
            </span>
            <Check size={13} />
          </div>
          <div className="banner-chip chip-years">
            <Heart size={16} />
            <span>
              <strong>8</strong> {t("years of your story", "বছরের গল্প")}
            </span>
          </div>
          <div className="banner-small-node node-one">
            <Stethoscope size={17} />
          </div>
          <div className="banner-small-node node-two">
            <ShieldCheck size={17} />
          </div>
        </div>
      </section>
      <div className="section-title-row">
        <h2>{t("Your health at a glance", "এক নজরে আপনার স্বাস্থ্য")}</h2>
        <span className="small muted">
          {t("A picture of your sample records", "আপনার নমুনা রেকর্ডের চিত্র")}
        </span>
      </div>
      <section
        className="overview-grid"
        aria-label={t("Health overview", "স্বাস্থ্য ওভারভিউ")}
      >
        <Link href="/summary" className="overview-card">
          <div className="overview-top">
            <span className="overview-icon icon-teal">
              <Heart size={18} />
            </span>
            <ArrowUpRight size={16} />
          </div>
          <span className="overview-label">
            {t("Current health summary", "বর্তমান স্বাস্থ্য সারাংশ")}
          </span>
          <h3>{t("The bigger picture", "সম্পূর্ণ চিত্র")}</h3>
          <p>
            <span className="status-dot" />
            {t("Ready for your next visit", "পরের ভিজিটের জন্য প্রস্তুত")}
          </p>
        </Link>
        <Link href="/documents" className="overview-card">
          <div className="overview-top">
            <span className="overview-icon icon-blue">
              <FileText size={18} />
            </span>
            <ArrowUpRight size={16} />
          </div>
          <span className="overview-label">
            {t("Recent reports", "সাম্প্রতিক রিপোর্ট")}
          </span>
          <h3>
            {records.filter((r) => r.kind === "lab").length}{" "}
            <span>{t("lab reports", "ল্যাব রিপোর্ট")}</span>
          </h3>
          <p>
            {t(
              "Every original, safely connected",
              "প্রতিটি মূল রিপোর্ট সংযুক্ত",
            )}
          </p>
        </Link>
        <Link href="/doctor-access" className="overview-card">
          <div className="overview-top">
            <span className="overview-icon icon-peach">
              <CalendarDays size={18} />
            </span>
            <ArrowUpRight size={16} />
          </div>
          <span className="overview-label">
            {t("Upcoming follow-up", "আসন্ন ফলো-আপ")}
          </span>
          <h3>
            {t("12 October", "১২ অক্টোবর")} <span>2026</span>
          </h3>
          <p>
            {t(
              "Dr. Farhana Ahmed · Sample visit",
              "ডা. ফারহানা আহমেদ · নমুনা ভিজিট",
            )}
          </p>
        </Link>
        <Link href="/timeline" className="overview-card alert-overview">
          <div className="overview-top">
            <span className="overview-icon icon-amber">
              <Sparkles size={18} />
            </span>
            <ArrowUpRight size={16} />
          </div>
          <span className="overview-label">
            {t("AI observations", "AI পর্যবেক্ষণ")}
          </span>
          <h3>
            1 <span>{t("trend to review", "পর্যালোচনার প্রবণতা")}</span>
          </h3>
          <p>
            <span className="amber-dot" />
            {t(
              "For your doctor’s attention",
              "আপনার ডাক্তারের পর্যালোচনার জন্য",
            )}
          </p>
        </Link>
      </section>
      <div className="dashboard-lower">
        <section className="card recent-activity">
          <div className="card-heading">
            <div>
              <h2>{t("Recent activity", "সাম্প্রতিক কার্যক্রম")}</h2>
              <p>
                {t(
                  "New chapters in your medical memory",
                  "আপনার স্বাস্থ্য স্মৃতির নতুন অধ্যায়",
                )}
              </p>
            </div>
            <Link href="/timeline" className="text-link">
              {t("View all", "সব দেখুন")}
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {latest.map((record, index) => (
              <div className="activity-item" key={record.id}>
                <div
                  className={`activity-icon ${record.kind === "prescription" ? "activity-blue" : ""}`}
                >
                  {record.kind === "prescription" ? (
                    <Stethoscope size={18} />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>
                <div className="activity-content">
                  <div className="activity-meta">
                    <span>
                      {index === 0
                        ? t("LATEST RECORD", "সর্বশেষ রেকর্ড")
                        : formatDate(record.date, language, true).toUpperCase()}
                    </span>
                    {index === 0 && <Tag>{t("New", "নতুন")}</Tag>}
                  </div>
                  <h3>{language === "bn" ? record.titleBn : record.title}</h3>
                  <p>{record.provider}</p>
                  <div className="activity-details">
                    <span>{record.finding}</span>
                    <DocumentButton record={record} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/upload" className="activity-add">
            <Plus size={16} />
            {t(
              "Another report? Add it to your story.",
              "আরও রিপোর্ট? আপনার গল্পে যোগ করুন।",
            )}
            <ArrowRight size={15} />
          </Link>
        </section>
        <div className="dashboard-right">
          <section className="card intelligence-card">
            <AiLabel />
            <h2>
              {t("A connection worth", "একটি গুরুত্বপূর্ণ")}
              <br />
              {t("a conversation.", "আলোচনার সূত্র।")}
            </h2>
            <p className="intelligence-bangla" lang="bn">
              আপনার গত ৬ মাসের রিপোর্টে hemoglobin trend কমেছে। ডাক্তারকে
              দেখানোর জন্য summary প্রস্তুত করা হয়েছে।
            </p>
            <div className="insight-detail">
              <span className="insight-detail-icon">
                <Activity size={18} />
              </span>
              <div>
                <strong>
                  {t("Hemoglobin trend", "হিমোগ্লোবিনের প্রবণতা")}
                </strong>
                <span>
                  {t(
                    "3 source reports · Jan – Aug 2026",
                    "৩টি মূল রিপোর্ট · জানু – আগস্ট ২০২৬",
                  )}
                </span>
              </div>
              <ArrowDownRight size={17} />
            </div>
            <div className="intelligence-actions">
              <button
                className="button button-dark button-small"
                onClick={downloadSummary}
              >
                {t("Get my summary", "আমার সারাংশ নিন")}
                <ArrowRight size={14} />
              </button>
              <Link href="/timeline" className="text-link">
                {t("View evidence", "প্রমাণ দেখুন")}
                <ArrowUpRight size={13} />
              </Link>
            </div>
            <ReviewNote />
          </section>
          <section className="card dashboard-trend">
            <div className="card-heading">
              <div>
                <h2>{t("Blood health", "রক্তের স্বাস্থ্য")}</h2>
                <p>{t("Hemoglobin · g/dL", "হিমোগ্লোবিন · g/dL")}</p>
              </div>
              <Link
                href="/trends"
                className="icon-button"
                aria-label={t(
                  "Explore health trends",
                  "স্বাস্থ্য প্রবণতা দেখুন",
                )}
              >
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="trend-value">
              11.2 <span>g/dL</span>
              <Tag color="amber">{t("For review", "পর্যালোচনার জন্য")}</Tag>
            </div>
            <HemoglobinChart compact />
            <div className="trend-footer">
              <span className="tiny-dot" />
              {t(
                "3 sample reports. One connected trend.",
                "৩টি নমুনা রিপোর্ট। একটি সংযুক্ত প্রবণতা।",
              )}
            </div>
          </section>
        </div>
      </div>
      <section className="next-visit">
        <div className="next-visit-icon">
          <Stethoscope size={24} />
        </div>
        <div>
          <h3>
            {t(
              "Walk into your next appointment with the full story.",
              "পরের অ্যাপয়েন্টমেন্টে সম্পূর্ণ গল্প নিয়ে যান।",
            )}
          </h3>
          <p>
            {t(
              "A clear summary. Your original reports. More time for what matters.",
              "একটি স্পষ্ট সারাংশ। আপনার মূল রিপোর্ট। জরুরি বিষয়ের জন্য আরও সময়।",
            )}
          </p>
        </div>
        <button
          className="button button-secondary button-small"
          onClick={downloadSummary}
        >
          {t("Prepare for my visit", "ভিজিটের জন্য প্রস্তুতি")}
          <ArrowRight size={15} />
        </button>
      </section>
    </div>
  );
}
