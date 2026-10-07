"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileImage,
  FileText,
  Fingerprint,
  Heart,
  Layers3,
  Link2,
  LockKeyhole,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Logo, LanguageSwitch, AiLabel, Tag } from "./ui";
import { useHealth } from "./provider";

export function LandingPage() {
  const { t } = useHealth();
  const [menu, setMenu] = useState(false);
  const workflow = [
    {
      icon: Upload,
      title: t("Upload", "আপলোড"),
      text: t("Any report. Any hospital.", "যেকোনো রিপোর্ট, যেকোনো হাসপাতাল।"),
    },
    {
      icon: ScanLine,
      title: t("Understand", "বোঝা"),
      text: t("Make sense of every detail.", "প্রতিটি তথ্য বোঝা।"),
    },
    {
      icon: Layers3,
      title: t("Structure", "সাজানো"),
      text: t("Turn records into clarity.", "রেকর্ডকে স্পষ্ট তথ্যে সাজানো।"),
    },
    {
      icon: Link2,
      title: t("Connect", "সংযুক্ত করা"),
      text: t("Bring your history together.", "আপনার ইতিহাস একত্র করা।"),
    },
    {
      icon: Activity,
      title: t("Detect changes", "পরিবর্তন খোঁজা"),
      text: t("See patterns over time.", "সময়ের সঙ্গে ধারা দেখা।"),
    },
    {
      icon: Sparkles,
      title: t("Summarize", "সারাংশ"),
      text: t("The context that matters.", "প্রয়োজনীয় তথ্যের সারাংশ।"),
    },
    {
      icon: Stethoscope,
      title: t("Share", "শেয়ার"),
      text: t(
        "Better prepared for your doctor.",
        "ডাক্তারের জন্য আরও ভালো প্রস্তুতি।",
      ),
    },
  ];
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-nav container">
          <Logo />
          <nav
            className={menu ? "site-nav open" : "site-nav"}
            aria-label={t("Main navigation", "প্রধান নেভিগেশন")}
          >
            <a href="#how-it-works" onClick={() => setMenu(false)}>
              {t("How it works", "যেভাবে কাজ করে")}
            </a>
            <a href="#your-memory" onClick={() => setMenu(false)}>
              {t("Why Nira", "কেন নীরা")}
            </a>
            <a href="#for-doctors" onClick={() => setMenu(false)}>
              {t("For doctors", "ডাক্তারদের জন্য")}
            </a>
          </nav>
          <div className="nav-actions">
            <LanguageSwitch />
            <Link href="/dashboard" className="nav-login">
              {t("Log in", "লগ ইন")}
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/dashboard" className="button button-dark button-small">
              {t("Get started", "শুরু করুন")}
              <ArrowRight size={15} />
            </Link>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={t("Toggle navigation", "নেভিগেশন খুলুন")}
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-grid container">
            <div className="hero-copy">
              <div className="eyebrow-pill">
                <span className="status-dot" />
                {t(
                  "A lifetime of health. One connected memory.",
                  "আজীবনের স্বাস্থ্য। একটি সংযুক্ত স্মৃতি।",
                )}
              </div>
              <h1>
                {t("Your medical history,", "আপনার স্বাস্থ্য ইতিহাস,")}
                <br />
                <span>
                  {t("remembered", "যত্নে রাখা")}
                  <br />
                  {t("forever.", "আজীবন।")}
                </span>
              </h1>
              <p className="hero-description">
                {t(
                  "Every report. Every prescription. Every chapter of your health story — connected, understood, and always with you.",
                  "প্রতিটি রিপোর্ট, প্রতিটি প্রেসক্রিপশন, আপনার স্বাস্থ্যের প্রতিটি অধ্যায় — সংযুক্ত, বোধগম্য ও সবসময় আপনার সঙ্গে।",
                )}
              </p>
              <p className="hero-bangla" lang="bn">
                AI আপনার সব medical records বুঝে একটি connected health memory
                তৈরি করে।
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/dashboard">
                  {t(
                    "Create your health memory",
                    "আপনার স্বাস্থ্য স্মৃতি তৈরি করুন",
                  )}
                  <ArrowRight size={17} />
                </Link>
                <a className="button button-ghost" href="#for-doctors">
                  {t("For doctors", "ডাক্তারদের জন্য")}
                  <ArrowUpRight size={17} />
                </a>
              </div>
              <div className="hero-reassurance">
                <span>
                  <ShieldCheck size={14} />
                  {t(
                    "Your data. Your control.",
                    "আপনার তথ্য। আপনার নিয়ন্ত্রণ।",
                  )}
                </span>
                <span className="reassurance-dot" />
                <span>{t("Built for a lifetime", "আজীবনের জন্য তৈরি")}</span>
              </div>
            </div>
            <MemoryVisual />
          </div>
          <div className="hero-bottom container">
            <span>
              {t("AI remembers your journey.", "AI আপনার পথচলা মনে রাখে।")}{" "}
              <strong>
                {t("Doctors make decisions.", "ডাক্তার সিদ্ধান্ত নেন।")}
              </strong>
            </span>
            <a href="#your-memory">
              {t("Discover a better way", "আরও ভালো পথ দেখুন")}
              <ArrowDown size={15} />
            </a>
          </div>
        </section>
        <section
          className="trust-strip container"
          aria-label={t("Platform principles", "প্ল্যাটফর্মের মূলনীতি")}
        >
          <span className="trust-strip-label">
            {t("Thoughtfully built around you", "আপনাকে ঘিরেই তৈরি")}
          </span>
          {[
            {
              icon: LockKeyhole,
              label: t("Private by design", "গোপনীয়তার জন্য তৈরি"),
            },
            {
              icon: Fingerprint,
              label: t("Patient-owned", "রোগীর মালিকানায়"),
            },
            {
              icon: ShieldCheck,
              label: t("Evidence-linked AI", "প্রমাণ-সংযুক্ত AI"),
            },
            {
              icon: Stethoscope,
              label: t("Doctor-led decisions", "ডাক্তারের সিদ্ধান্ত"),
            },
          ].map((item) => (
            <span key={item.label}>
              <item.icon size={19} />
              {item.label}
            </span>
          ))}
        </section>
        <section
          id="your-memory"
          className="problem-section container section-space"
        >
          <div className="section-heading">
            <span className="overline">
              {t("THE MISSING CONNECTION", "হারিয়ে যাওয়া সংযোগ")}
            </span>
            <h2>
              {t("Healthcare is continuous.", "স্বাস্থ্যসেবা চলমান।")}
              <br />
              <span>
                {t("Medical records are not.", "মেডিক্যাল রেকর্ড নয়।")}
              </span>
            </h2>
            <p>
              {t(
                "Your story shouldn’t start over at every appointment. Give your health history the continuity it deserves.",
                "প্রতিটি অ্যাপয়েন্টমেন্টে আপনার গল্প নতুন করে শুরু করার দরকার নেই। আপনার স্বাস্থ্য ইতিহাসে ধারাবাহিকতা আনুন।",
              )}
            </p>
          </div>
          <div className="before-after">
            <div className="before-card">
              <Tag color="neutral">{t("THE WAY IT IS", "এখন যেভাবে আছে")}</Tag>
              <div className="scattered-records">
                <div className="paper paper-one">
                  <FileText size={24} />
                  <span>LAB REPORT</span>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="paper paper-two">
                  <FileImage size={23} />
                  <span>PRESCRIPTION</span>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="paper paper-three">
                  <FileText size={23} />
                  <span>DISCHARGE</span>
                  <i />
                  <i />
                  <i />
                </div>
                <span className="paper-dash">?</span>
              </div>
              <h3>
                {t("A folder full of fragments.", "ছড়িয়ে থাকা অসংখ্য তথ্য।")}
              </h3>
              <p>
                {t(
                  "Paper reports. Scattered PDFs. Different hospitals. Important details lost in between.",
                  "কাগজের রিপোর্ট। ছড়ানো PDF। ভিন্ন হাসপাতাল। মাঝখানে হারিয়ে যায় গুরুত্বপূর্ণ তথ্য।",
                )}
              </p>
            </div>
            <div className="transform-arrow">
              <ArrowRight size={22} />
            </div>
            <div className="after-card">
              <Tag>{t("THE NIRA WAY", "নীরার পথ")}</Tag>
              <div className="connected-memory">
                <div className="memory-core">
                  <Activity size={31} />
                </div>
                {[FileText, Heart, Stethoscope, Activity].map((Icon, i) => (
                  <div key={i} className={`memory-satellite satellite-${i}`}>
                    <Icon size={22} />
                  </div>
                ))}
                <svg viewBox="0 0 300 160" aria-hidden="true">
                  <path
                    d="M65 35 L150 80 L238 35 M65 126 L150 80 L238 126"
                    fill="none"
                    stroke="#c1dcd2"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
              <h3>
                {t(
                  "One connected health story.",
                  "একটি সংযুক্ত স্বাস্থ্য গল্প।",
                )}
              </h3>
              <p>
                {t(
                  "A living medical memory that connects the dots, preserves context, and grows with you.",
                  "একটি জীবন্ত স্বাস্থ্য স্মৃতি যা তথ্য যুক্ত করে, প্রসঙ্গ ধরে রাখে ও আপনার সঙ্গে বাড়ে।",
                )}
              </p>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="workflow-section section-space">
          <div className="container">
            <div className="section-heading centered">
              <span className="overline">
                {t("FROM RECORDS TO REMEMBRANCE", "রেকর্ড থেকে স্মৃতিতে")}
              </span>
              <h2>
                {t("A little upload.", "ছোট্ট একটি আপলোড।")}{" "}
                <span>{t("A big picture.", "সম্পূর্ণ একটি চিত্র।")}</span>
              </h2>
              <p>
                {t(
                  "Behind every simple step, a more connected understanding of you.",
                  "প্রতিটি সহজ ধাপে আপনার সম্পর্কে আরও সংযুক্ত উপলব্ধি।",
                )}
              </p>
            </div>
            <div className="workflow-steps">
              {workflow.map((step, index) => (
                <div className="workflow-step" key={step.title}>
                  <div className="workflow-icon">
                    <step.icon size={23} />
                    <span>0{index + 1}</span>
                  </div>
                  {index < workflow.length - 1 && (
                    <ChevronRight className="workflow-arrow" size={15} />
                  )}
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
            <div className="workflow-note">
              <Sparkles size={16} />
              <span>
                {t(
                  "Always linked to the source. Always ready for doctor review.",
                  "সবসময় মূল রিপোর্টের সঙ্গে যুক্ত। ডাক্তারের পর্যালোচনার জন্য প্রস্তুত।",
                )}
              </span>
            </div>
          </div>
        </section>
        <section
          id="for-doctors"
          className="doctor-section container section-space"
        >
          <div className="doctor-copy">
            <span className="overline">
              {t(
                "MORE CONTEXT. BETTER CONVERSATIONS.",
                "আরও তথ্য। আরও ভালো আলোচনা।",
              )}
            </span>
            <h2>
              {t("The full story,", "সম্পূর্ণ গল্প,")}
              <br />
              <span>
                {t("before the appointment.", "অ্যাপয়েন্টমেন্টের আগেই।")}
              </span>
            </h2>
            <p>
              {t(
                "Spend less time piecing together the past. Arrive with a clear timeline, meaningful trends, and the original evidence — so you can focus on your patient.",
                "পুরোনো তথ্য একত্র করতে কম সময় দিন। একটি স্পষ্ট টাইমলাইন, গুরুত্বপূর্ণ প্রবণতা ও মূল প্রমাণ নিয়ে রোগীর দিকে মনোযোগ দিন।",
              )}
            </p>
            <div className="doctor-benefits">
              <span>
                <CircleCheck size={17} />
                {t(
                  "Longitudinal clinical context",
                  "দীর্ঘমেয়াদি ক্লিনিক্যাল তথ্য",
                )}
              </span>
              <span>
                <CircleCheck size={17} />
                {t("Patient-controlled access", "রোগীর নিয়ন্ত্রিত অ্যাক্সেস")}
              </span>
              <span>
                <CircleCheck size={17} />
                {t(
                  "AI supports. You decide.",
                  "AI সহায়তা করে। আপনি সিদ্ধান্ত নেন।",
                )}
              </span>
            </div>
            <Link className="button button-dark" href="/timeline">
              {t("Explore a patient timeline", "রোগীর টাইমলাইন দেখুন")}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="doctor-preview">
            <div className="preview-top">
              <div className="avatar avatar-teal">RH</div>
              <div>
                <strong>Rakib Hasan</strong>
                <span>
                  {t("Clinical memory preview", "স্বাস্থ্য স্মৃতির প্রিভিউ")}
                </span>
              </div>
              <ShieldCheck size={21} />
            </div>
            <div className="preview-summary">
              <AiLabel />{" "}
              <h4>
                {t("8 years. A clearer picture.", "৮ বছর। আরও স্পষ্ট চিত্র।")}
              </h4>
              <p>
                {t(
                  "5 connected records across 4 healthcare providers.",
                  "৪টি স্বাস্থ্যসেবা প্রতিষ্ঠানের ৫টি সংযুক্ত রেকর্ড।",
                )}
              </p>
            </div>
            <div className="preview-event">
              <div className="event-dot" />
              <div>
                <span>18 AUG 2026</span>
                <strong>
                  {t(
                    "Blood health trend identified",
                    "রক্তের স্বাস্থ্য প্রবণতা শনাক্ত",
                  )}
                </strong>
                <p>{t("3 reports connected", "৩টি রিপোর্ট সংযুক্ত")}</p>
              </div>
              <Activity size={19} />
            </div>
            <div className="preview-event">
              <div className="event-dot" />
              <div>
                <span>06 APR 2026</span>
                <strong>
                  {t("Follow-up prescription", "ফলো-আপ প্রেসক্রিপশন")}
                </strong>
                <p>
                  {t(
                    "Linked to earlier investigations",
                    "আগের পরীক্ষার সঙ্গে সংযুক্ত",
                  )}
                </p>
              </div>
              <FileText size={18} />
            </div>
            <div className="preview-bottom">
              <CheckCheck size={16} />
              {t(
                "Original sources included · Sample record",
                "মূল উৎস সংযুক্ত · নমুনা রেকর্ড",
              )}
            </div>
          </div>
        </section>
        <section className="ownership-section container">
          <div className="ownership-top">
            <span className="overline">
              {t("TRUST IS THE FOUNDATION", "বিশ্বাসই ভিত্তি")}
            </span>
            <h2>
              {t("Your health is personal.", "আপনার স্বাস্থ্য ব্যক্তিগত।")}
              <br />
              <span>
                {t(
                  "Your memory should be, too.",
                  "আপনার স্মৃতিও ব্যক্তিগত থাকুক।",
                )}
              </span>
            </h2>
          </div>
          <div className="ownership-grid">
            {[
              {
                icon: LockKeyhole,
                title: t("Secure by design", "সুরক্ষার জন্য তৈরি"),
                text: t(
                  "Privacy at every step. The demo keeps your uploads in this browser.",
                  "প্রতিটি ধাপে গোপনীয়তা। ডেমো আপলোড এই ব্রাউজারেই থাকে।",
                ),
              },
              {
                icon: Users,
                title: t("You own your story", "আপনার গল্প আপনার"),
                text: t(
                  "Your records, your choices. Built around patient ownership.",
                  "আপনার রেকর্ড, আপনার সিদ্ধান্ত। রোগীর মালিকানায় তৈরি।",
                ),
              },
              {
                icon: Stethoscope,
                title: t("Human judgment first", "মানুষের বিচার আগে"),
                text: t(
                  "Information for doctor review. Never an AI diagnosis.",
                  "ডাক্তারের পর্যালোচনার জন্য তথ্য। AI রোগ নির্ণয় নয়।",
                ),
              },
              {
                icon: Link2,
                title: t("Evidence, not guesswork", "অনুমান নয়, প্রমাণ"),
                text: t(
                  "Every insight connects back to its original document.",
                  "প্রতিটি তথ্য মূল ডকুমেন্টের সঙ্গে যুক্ত।",
                ),
              },
            ].map((item) => (
              <div key={item.title}>
                <item.icon size={25} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="cta-section container">
          <div>
            <span className="overline">
              {t("THE NEXT CHAPTER STARTS HERE", "পরের অধ্যায় এখান থেকেই")}
            </span>
            <h2>
              {t("A healthier future starts", "সুস্থ ভবিষ্যৎ শুরু হয়")}
              <br />
              {t("with a remembered past.", "মনে রাখা অতীত থেকে।")}
            </h2>
            <p lang="bn">আপনার আজীবনের স্বাস্থ্য স্মৃতি। আপনার নিয়ন্ত্রণে।</p>
          </div>
          <Link href="/dashboard" className="button button-primary">
            {t("Create your health memory", "আপনার স্বাস্থ্য স্মৃতি তৈরি করুন")}
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>
      <footer className="landing-footer container">
        <div>
          <Logo />
          <p>
            {t(
              "AI remembers. Doctors decide.",
              "AI মনে রাখে। ডাক্তার সিদ্ধান্ত নেন।",
            )}
          </p>
        </div>
        <span>
          © 2026 Nira Health · {t("Made for your journey", "আপনার পথচলার জন্য")}
        </span>
        <LanguageSwitch compact />
      </footer>
    </div>
  );
}

function MemoryVisual() {
  const { t } = useHealth();
  return (
    <div
      className="hero-visual"
      aria-label={t(
        "Medical documents become a connected clinical memory",
        "মেডিক্যাল ডকুমেন্ট থেকে সংযুক্ত স্বাস্থ্য স্মৃতি",
      )}
    >
      <div className="visual-grid" />
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="visual-caption">
        <span className="status-dot" />
        {t("YOUR HEALTH, CONNECTED", "আপনার স্বাস্থ্য, সংযুক্ত")}
      </div>
      <div className="floating-report report-pdf">
        <div className="report-icon">
          <FileText size={21} />
        </div>
        <div>
          <strong>{t("Lab report", "ল্যাব রিপোর্ট")}</strong>
          <span>CBC_March_2026.pdf</span>
        </div>
        <span className="file-label">PDF</span>
      </div>
      <div className="floating-report report-rx">
        <div className="report-icon rx-icon">
          <Stethoscope size={21} />
        </div>
        <div>
          <strong>{t("Prescription", "প্রেসক্রিপশন")}</strong>
          <span>06 Apr, 2026</span>
        </div>
        <Check size={15} />
      </div>
      <svg
        className="visual-connectors"
        viewBox="0 0 550 510"
        aria-hidden="true"
      >
        <path
          d="M135 105 C135 180 280 150 280 230 M435 152 C435 195 330 182 280 230 M280 270 L280 345"
          fill="none"
          stroke="#91bdb1"
          strokeWidth="1.3"
          strokeDasharray="4 6"
        />
        <circle cx="135" cy="105" r="4" fill="#7aa99a" />
        <circle cx="435" cy="152" r="4" fill="#7aa99a" />
      </svg>
      <div className="ai-engine">
        <div className="engine-inner">
          <Activity size={39} strokeWidth={1.8} />
        </div>
        <span className="engine-spark">
          <Sparkles size={15} />
        </span>
      </div>
      <div className="engine-caption">
        <span>{t("NIRA INTELLIGENCE", "নীরা ইন্টেলিজেন্স")}</span>
        <p>
          {t(
            "Understands. Connects. Remembers.",
            "বোঝে। সংযুক্ত করে। মনে রাখে।",
          )}
        </p>
      </div>
      <div className="memory-preview">
        <div className="memory-preview-header">
          <span>
            <Layers3 size={16} />
            {t("Your medical memory", "আপনার স্বাস্থ্য স্মৃতি")}
          </span>
          <Tag>
            <span className="status-dot" />
            {t("Connected", "সংযুক্ত")}
          </Tag>
        </div>
        <div className="memory-mini-timeline">
          <div>
            <span className="mini-timeline-dot teal-dot" />
            <small>2026</small>
            <strong>{t("Blood health", "রক্তের স্বাস্থ্য")}</strong>
            <span className="mini-timeline-data">
              3 {t("reports linked", "রিপোর্ট যুক্ত")}
            </span>
            <Activity size={15} />
          </div>
          <div>
            <span className="mini-timeline-dot blue-dot" />
            <small>2026</small>
            <strong>{t("Follow-up care", "ফলো-আপ চিকিৎসা")}</strong>
            <span className="mini-timeline-data">
              {t("Prescription", "প্রেসক্রিপশন")}
            </span>
            <FileText size={14} />
          </div>
          <div>
            <span className="mini-timeline-dot grey-dot" />
            <small>2018</small>
            <strong>{t("Your history", "আপনার ইতিহাস")}</strong>
            <span className="mini-timeline-data">
              {t("Always remembered", "সবসময় মনে রাখা")}
            </span>
            <Clock3 size={14} />
          </div>
        </div>
      </div>
      <div className="memory-floating-badge">
        <div>
          <ShieldCheck size={19} />
        </div>
        <span>
          {t("A lifetime of context.", "আজীবনের তথ্য।")}
          <strong>{t("Always yours.", "সবসময় আপনার।")}</strong>
        </span>
      </div>
      <span className="visual-sample">
        {t("Illustrative clinical memory", "উদাহরণ স্বাস্থ্য স্মৃতি")}
      </span>
    </div>
  );
}
