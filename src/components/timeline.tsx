"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  Hospital,
  Link2,
  Plus,
  Search,
  SlidersHorizontal,
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
  Verified,
} from "./ui";
import { formatDate, type MedicalRecord } from "@/lib/records";

export function Timeline() {
  const { t, language, records, downloadSummary } = useHealth();
  const [filter, setFilter] = useState("all");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("record");
    if (id)
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [records]);
  const sorted = [...records]
    .filter(
      (r) =>
        (filter === "all" || r.kind === filter) &&
        (year === "all" || r.date.startsWith(year)) &&
        `${r.title} ${r.titleBn} ${r.provider} ${r.finding}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
    );
  const years = Array.from(new Set(records.map((r) => r.date.slice(0, 4))))
    .sort()
    .reverse();
  return (
    <div className="timeline-page page-enter">
      <div className="page-heading">
        <div>
          <div className="page-overline">
            <History size={14} />
            {t("EVERY CHAPTER, CONNECTED", "প্রতিটি অধ্যায়, সংযুক্ত")}
          </div>
          <h1>{t("Your medical timeline", "আপনার মেডিক্যাল টাইমলাইন")}</h1>
          <p>
            {t(
              "Not just a history of records. The story of you.",
              "শুধু রেকর্ডের ইতিহাস নয়। এটি আপনার গল্প।",
            )}
          </p>
        </div>
        <div className="page-heading-actions">
          <button className="button button-secondary" onClick={downloadSummary}>
            <ArrowDownToLine size={16} />
            {t("Export summary", "সারাংশ এক্সপোর্ট")}
          </button>
          <Link className="button button-primary" href="/upload">
            <Plus size={16} />
            {t("Add record", "রেকর্ড যোগ")}
          </Link>
        </div>
      </div>
      <div className="timeline-overview">
        <div>
          <span className="timeline-overview-icon">
            <History size={21} />
          </span>
          <strong>
            8{" "}
            <span>
              {t("years of health history", "বছরের স্বাস্থ্য ইতিহাস")}
            </span>
          </strong>
        </div>
        <span className="timeline-stat-divider" />
        <div>
          <FileText size={18} />
          <strong>
            {records.length}{" "}
            <span>{t("connected records", "সংযুক্ত রেকর্ড")}</span>
          </strong>
        </div>
        <span className="timeline-stat-divider" />
        <div>
          <Hospital size={18} />
          <strong>
            {new Set(records.map((r) => r.provider)).size}{" "}
            <span>{t("care providers", "স্বাস্থ্যসেবা প্রতিষ্ঠান")}</span>
          </strong>
        </div>
        <Tag>
          <Link2 size={12} />
          {t("One continuous story", "একটি ধারাবাহিক গল্প")}
        </Tag>
      </div>
      <div className="timeline-layout">
        <section className="timeline-main">
          <div className="timeline-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label={t("Filter record type", "রেকর্ডের ধরন বাছাই")}
            >
              {[
                { value: "all", label: t("All records", "সব রেকর্ড") },
                { value: "lab", label: t("Lab reports", "ল্যাব রিপোর্ট") },
                {
                  value: "prescription",
                  label: t("Prescriptions", "প্রেসক্রিপশন"),
                },
                { value: "hospital", label: t("Hospital", "হাসপাতাল") },
              ].map((item) => (
                <button
                  key={item.value}
                  className={filter === item.value ? "selected" : ""}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="year-select">
              <SlidersHorizontal size={14} />
              <select
                aria-label={t("Filter year", "বছর বাছাই")}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="all">{t("All years", "সব বছর")}</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="timeline-search-row">
            <label>
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(
                  "Find an event in your story…",
                  "আপনার গল্পে একটি ঘটনা খুঁজুন…",
                )}
                aria-label={t("Search timeline", "টাইমলাইন খুঁজুন")}
              />
            </label>
            <button
              className="text-link muted"
              onClick={() => setAscending(!ascending)}
            >
              {ascending
                ? t("Oldest first", "পুরোনো আগে")
                : t("Newest first", "নতুন আগে")}
              <ChevronDown size={14} className={ascending ? "rotate" : ""} />
            </button>
          </div>
          <div className="timeline-events">
            {sorted.map((record, index) => (
              <div key={record.id}>
                {(index === 0 ||
                  record.date.slice(0, 4) !==
                    sorted[index - 1].date.slice(0, 4)) && (
                  <div className="timeline-year">
                    <span>{record.date.slice(0, 4)}</span>
                    <small>
                      {record.date.startsWith("2018")
                        ? t("WHERE YOUR STORY BEGINS", "যেখানে আপনার গল্প শুরু")
                        : t("YOUR STORY CONTINUES", "আপনার গল্প চলমান")}
                    </small>
                  </div>
                )}
                <TimelineCard record={record} />
              </div>
            ))}
            {!sorted.length && (
              <div className="card empty-state">
                <Search size={30} />
                <h3>
                  {t(
                    "No records in this chapter yet.",
                    "এই অধ্যায়ে এখনো কোনো রেকর্ড নেই।",
                  )}
                </h3>
                <p>
                  {t(
                    "Try another filter, or add a medical record.",
                    "অন্য ফিল্টার ব্যবহার করুন বা রেকর্ড যোগ করুন।",
                  )}
                </p>
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setFilter("all");
                    setYear("all");
                    setQuery("");
                  }}
                >
                  {t("Reset filters", "ফিল্টার রিসেট")}
                </button>
              </div>
            )}
          </div>
          <div className="timeline-end">
            <span>
              <HeartMark />
            </span>
            <p>
              {t(
                "Your story keeps growing. We’ll keep remembering.",
                "আপনার গল্প বাড়তে থাকবে। আমরা মনে রাখব।",
              )}
            </p>
            <Link href="/upload" className="text-link">
              {t("Add the next chapter", "পরের অধ্যায় যোগ করুন")}
              <Plus size={13} />
            </Link>
          </div>
        </section>
        <aside className="timeline-insights">
          <section className="card timeline-insight-card">
            <AiLabel>{t("THE CONNECTED PICTURE", "সংযুক্ত চিত্র")}</AiLabel>
            <h2>
              {t("Patterns emerge", "তথ্য সংযুক্ত হলে")}
              <br />
              {t("when history connects.", "ধারা স্পষ্ট হয়।")}
            </h2>
            <div className="insight-heading">
              <div className="overview-icon icon-teal">
                <Activity size={20} />
              </div>
              <div>
                <strong>{t("Hemoglobin", "হিমোগ্লোবিন")}</strong>
                <span>
                  {t("January – August 2026", "জানুয়ারি – আগস্ট ২০২৬")}
                </span>
              </div>
              <Tag color="amber">{t("For review", "পর্যালোচনা")}</Tag>
            </div>
            <HemoglobinChart />
            <p className="insight-explanation">
              {t(
                "Your hemoglobin has decreased across multiple reports. These results are connected for your doctor to assess in context.",
                "একাধিক রিপোর্টে আপনার হিমোগ্লোবিন কমেছে। চিকিৎসক সামগ্রিকভাবে মূল্যায়ন করার জন্য রিপোর্টগুলো সংযুক্ত করা হয়েছে।",
              )}
            </p>
            <div className="evidence-links">
              <span className="overline">
                {t("LINKED EVIDENCE", "সংযুক্ত প্রমাণ")}
              </span>
              {records
                .filter((r) =>
                  ["blood-jan", "cbc-mar", "cbc-aug"].includes(r.id),
                )
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((r) => (
                  <a
                    key={r.id}
                    href={`#${r.id}`}
                    onClick={() => {
                      setFilter("all");
                      setYear("all");
                      setQuery("");
                    }}
                  >
                    <FileText size={14} />
                    <span>{formatDate(r.date, language, true)}</span>
                    <strong>
                      {r.hemoglobin} <small>g/dL</small>
                    </strong>
                    <ArrowUpRight size={12} />
                  </a>
                ))}
            </div>
            <ReviewNote />
          </section>
          <section className="card timeline-review-card">
            <div className="review-card-icon">
              <Stethoscope size={22} />
            </div>
            <h3>
              {t("More prepared.", "আরও প্রস্তুতি।")}
              <br />
              {t("More peace of mind.", "আরও মানসিক স্বস্তি।")}
            </h3>
            <p>
              {t(
                "Bring the full picture to your next appointment. Your doctor gets the context, you get a better conversation.",
                "পরের অ্যাপয়েন্টমেন্টে সম্পূর্ণ তথ্য নিয়ে যান। ডাক্তার পান বিস্তারিত তথ্য, আপনি পান আরও ভালো আলোচনা।",
              )}
            </p>
            <button className="button button-dark" onClick={downloadSummary}>
              {t("Get visit summary", "ভিজিটের সারাংশ নিন")}
              <ArrowRight size={15} />
            </button>
          </section>
          <div className="timeline-safety">
            <ShieldIcon />
            <span>
              {t(
                "Sample insights illustrate connections in records. They are not diagnoses or treatment recommendations.",
                "নমুনা তথ্য রেকর্ডের সংযোগ দেখায়। এগুলো রোগ নির্ণয় বা চিকিৎসার পরামর্শ নয়।",
              )}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TimelineCard({ record }: { record: MedicalRecord }) {
  const { t, language } = useHealth();
  const [expanded, setExpanded] = useState(false);
  const Icon =
    record.kind === "prescription"
      ? Stethoscope
      : record.kind === "hospital"
        ? Hospital
        : FileText;
  return (
    <article
      id={record.id}
      className={`timeline-event ${record.id === "cbc-aug" ? "highlight-event" : ""}`}
    >
      <div
        className={`timeline-event-marker ${record.kind === "prescription" ? "marker-blue" : ""}`}
      >
        <Icon size={17} />
      </div>
      <div className="timeline-event-card">
        <div className="timeline-event-top">
          <span className="event-date">
            {formatDate(record.date, language)}
          </span>
          <Verified verified={record.verified} />
        </div>
        <h3>{language === "bn" ? record.titleBn : record.title}</h3>
        <p className="event-provider">{record.provider}</p>
        <div className="event-finding">
          <Icon size={15} />
          <span>{record.finding}</span>
          {record.id === "cbc-aug" && (
            <Tag color="amber">{t("Trend detected", "প্রবণতা শনাক্ত")}</Tag>
          )}
        </div>
        <div className="event-ai-note">
          <Sparkles size={14} />
          <p>{language === "bn" ? record.explanationBn : record.explanation}</p>
        </div>
        {expanded && (
          <div className="expanded-record">
            <div>
              <span>{t("Original file", "মূল ফাইল")}</span>
              <strong>{record.fileName}</strong>
            </div>
            <div>
              <span>{t("Medication", "ওষুধ")}</span>
              <strong>
                {record.medicine ||
                  t("Not recorded in this document", "এই ডকুমেন্টে উল্লেখ নেই")}
              </strong>
            </div>
            <div>
              <span>{t("Recorded diagnosis", "রেকর্ডে থাকা রোগনির্ণয়")}</span>
              <strong>
                {record.diagnosis ||
                  t(
                    "Not recorded — no AI diagnosis inferred",
                    "উল্লেখ নেই — AI রোগ নির্ণয় করেনি",
                  )}
              </strong>
            </div>
            <div>
              <span>{t("Record type", "রেকর্ডের ধরন")}</span>
              <strong>
                {record.isUploaded
                  ? t(
                      "Locally saved · patient-entered",
                      "স্থানীয়ভাবে সংরক্ষিত · রোগীর দেওয়া",
                    )
                  : t("Illustrative sample", "উদাহরণ রেকর্ড")}
              </strong>
            </div>
          </div>
        )}
        <div className="timeline-event-bottom">
          <DocumentButton record={record} />
          <button
            className="text-link muted"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? t("Less detail", "কম তথ্য")
              : t("Record details", "রেকর্ডের বিস্তারিত")}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
    </article>
  );
}
function HeartMark() {
  return <Activity size={18} />;
}
function ShieldIcon() {
  return <Check size={16} />;
}
