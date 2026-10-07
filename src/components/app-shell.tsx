"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookHeart,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  FileText,
  Heart,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { Logo, LanguageSwitch, Modal } from "./ui";
import { useHealth } from "./provider";

export function AppShell({ children }: { children: ReactNode }) {
  const { t, records, language } = useHealth();
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [help, setHelp] = useState(false);
  const [profile, setProfile] = useState(false);
  const navigation = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t("Overview", "ওভারভিউ"),
    },
    {
      href: "/timeline",
      icon: BookHeart,
      label: t("Medical timeline", "মেডিক্যাল টাইমলাইন"),
    },
    {
      href: "/documents",
      icon: FileText,
      label: t("Documents", "ডকুমেন্ট"),
      count: records.length,
    },
    { href: "/summary", icon: Sparkles, label: t("AI summary", "AI সারাংশ") },
    {
      href: "/trends",
      icon: ChartNoAxesCombined,
      label: t("Health trends", "স্বাস্থ্য প্রবণতা"),
    },
    {
      href: "/doctor-access",
      icon: Stethoscope,
      label: t("Doctor access", "ডাক্তার অ্যাক্সেস"),
    },
  ];
  const active =
    pathname === "/upload"
      ? t("Upload records", "রেকর্ড আপলোড")
      : pathname === "/settings"
        ? t("Settings", "সেটিংস")
        : navigation.find((n) => n.href === pathname)?.label ||
          t("Your memory", "আপনার স্মৃতি");
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {t("Skip to content", "মূল অংশে যান")}
      </a>
      {mobile && (
        <div className="sidebar-overlay" onClick={() => setMobile(false)} />
      )}
      <aside className={`sidebar ${mobile ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <Logo />
          <button
            className="icon-button sidebar-close"
            onClick={() => setMobile(false)}
            aria-label={t("Close navigation", "নেভিগেশন বন্ধ করুন")}
          >
            <X size={19} />
          </button>
        </div>
        <div className="workspace-switch">
          <div className="workspace-icon">
            <Heart size={17} />
          </div>
          <div>
            <strong>{t("Personal workspace", "ব্যক্তিগত ওয়ার্কস্পেস")}</strong>
            <span>
              {t("Your lifelong health story", "আপনার আজীবনের স্বাস্থ্য গল্প")}
            </span>
          </div>
          <span className="workspace-dot" />
        </div>
        <div className="nav-group-label">
          {t("YOUR HEALTH MEMORY", "আপনার স্বাস্থ্য স্মৃতি")}
        </div>
        <nav aria-label={t("Patient navigation", "রোগীর নেভিগেশন")}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setMobile(false)}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="nav-count">{item.count}</span>
              )}
              {pathname === item.href && <span className="active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <Link
          className={`sidebar-link ${pathname === "/settings" ? "active" : ""}`}
          href="/settings"
          onClick={() => setMobile(false)}
        >
          <Settings2 size={19} />
          <span>{t("Settings", "সেটিংস")}</span>
        </Link>
        <button className="sidebar-link" onClick={() => setHelp(true)}>
          <CircleHelp size={19} />
          <span>{t("Help & support", "সাহায্য ও সহায়তা")}</span>
          <ArrowUpRight size={14} />
        </button>
        <div className="sidebar-bottom">
          <div className="sidebar-memory-card">
            <div className="mini-logo">
              <Activity size={20} />
            </div>
            <strong>
              {t("A little more connected.", "আরও একটু সংযুক্ত।")}
            </strong>
            <p>
              {t(
                "Every record adds a chapter to your story.",
                "প্রতিটি রেকর্ড আপনার গল্পে নতুন অধ্যায় যোগ করে।",
              )}
            </p>
            <Link href="/upload">
              {t("Add a medical record", "মেডিক্যাল রেকর্ড যোগ করুন")}
              <Plus size={15} />
            </Link>
          </div>
          <button className="sidebar-profile" onClick={() => setProfile(true)}>
            <div className="avatar">RH</div>
            <div>
              <strong>Rakib Hasan</strong>
              <span>
                {t("Personal account · Demo", "ব্যক্তিগত অ্যাকাউন্ট · ডেমো")}
              </span>
            </div>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobile(true)}
              aria-label={t("Open navigation", "নেভিগেশন খুলুন")}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb-home">
              {t("My workspace", "আমার ওয়ার্কস্পেস")}
            </span>
            <span className="breadcrumb-slash">/</span>
            <strong>{active}</strong>
          </div>
          <div className="header-actions">
            <button
              className="search-button"
              onClick={() => setSearch(true)}
              aria-label={t("Search records", "রেকর্ড খুঁজুন")}
            >
              <Search size={17} />
              <span>{t("Search your memory", "আপনার স্মৃতি খুঁজুন")}</span>
              <kbd>⌕</kbd>
            </button>
            <LanguageSwitch compact />
            <span className="header-divider" />
            <button
              className="notification-button icon-button"
              onClick={() => setNotifications(true)}
              aria-label={t("View notifications", "বিজ্ঞপ্তি দেখুন")}
            >
              <Bell size={19} />
              <span />
            </button>
            <button
              className="avatar avatar-small"
              onClick={() => setProfile(true)}
              aria-label={t("Open patient profile", "রোগীর প্রোফাইল খুলুন")}
            >
              RH
            </button>
          </div>
        </header>
        <main id="main-content" className="app-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>
            <ShieldCheck size={12} />
            {t(
              "Your health story belongs to you.",
              "আপনার স্বাস্থ্য গল্প আপনারই।",
            )}
          </span>
          <span>
            {t(
              "Interactive demo · Local browser storage",
              "ইন্টারঅ্যাকটিভ ডেমো · স্থানীয় ব্রাউজার স্টোরেজ",
            )}
          </span>
        </footer>
      </div>
      {search && (
        <Modal
          title={t(
            "Search your medical memory",
            "আপনার স্বাস্থ্য স্মৃতি খুঁজুন",
          )}
          onClose={() => {
            setSearch(false);
            setQuery("");
          }}
        >
          <div className="modal-search">
            <Search size={18} />
            <input
              autoFocus
              placeholder={t(
                "Try “blood”, “prescription”, or a hospital…",
                "রক্ত, প্রেসক্রিপশন বা হাসপাতাল খুঁজুন…",
              )}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("Search query", "অনুসন্ধান")}
            />
          </div>
          <div className="search-results">
            {records
              .filter((r) =>
                `${r.title} ${r.titleBn} ${r.provider} ${r.finding} ${r.date}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((r) => (
                <Link
                  href={`/timeline?record=${r.id}`}
                  key={r.id}
                  onClick={() => {
                    setSearch(false);
                    setQuery("");
                  }}
                >
                  <span className="document-icon">
                    <FileText size={18} />
                  </span>
                  <span>
                    <strong>{language === "bn" ? r.titleBn : r.title}</strong>
                    <small>
                      {r.date} · {r.provider}
                    </small>
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            {!records.some((r) =>
              `${r.title} ${r.titleBn} ${r.provider} ${r.finding} ${r.date}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            ) && (
              <div className="empty-state">
                {t(
                  "No matching records. Try a different term.",
                  "মিলে যাওয়া রেকর্ড নেই। অন্য শব্দ দিয়ে খুঁজুন।",
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
      {notifications && (
        <Modal
          title={t("Your updates", "আপনার আপডেট")}
          onClose={() => setNotifications(false)}
        >
          <div className="notification-item">
            <div className="document-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h3>
                {t(
                  "A new connection in your history",
                  "আপনার ইতিহাসে নতুন সংযোগ",
                )}
              </h3>
              <p>
                {t(
                  "Your sample blood reports show a hemoglobin trend. Your doctor can review the source documents.",
                  "নমুনা রক্ত রিপোর্টে হিমোগ্লোবিনের প্রবণতা দেখা যায়। আপনার ডাক্তার মূল রিপোর্ট পর্যালোচনা করতে পারবেন।",
                )}
              </p>
              <Link
                href="/timeline"
                className="text-link"
                onClick={() => setNotifications(false)}
              >
                {t("View timeline", "টাইমলাইন দেখুন")}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <p className="muted small">
            {t(
              "Demo notification — no real clinical monitoring is active.",
              "ডেমো বিজ্ঞপ্তি — প্রকৃত ক্লিনিক্যাল পর্যবেক্ষণ সক্রিয় নয়।",
            )}
          </p>
        </Modal>
      )}
      {help && (
        <Modal
          title={t(
            "A little help with your memory",
            "আপনার স্মৃতির জন্য সাহায্য",
          )}
          onClose={() => setHelp(false)}
        >
          <div className="help-content">
            <h3>{t("How do I add a record?", "কীভাবে রেকর্ড যোগ করব?")}</h3>
            <p>
              {t(
                "Open Upload records, choose a PDF or image, and review the record details before saving. Files stay in this browser.",
                "রেকর্ড আপলোড খুলুন, PDF বা ছবি বেছে নিন এবং সংরক্ষণের আগে তথ্য যাচাই করুন। ফাইল এই ব্রাউজারেই থাকে।",
              )}
            </p>
            <h3>{t("Is this medical advice?", "এটি কি চিকিৎসা পরামর্শ?")}</h3>
            <p>
              {t(
                "No. Insights are illustrative and support doctor review. A clinician makes medical decisions.",
                "না। তথ্যগুলো উদাহরণ এবং ডাক্তারের পর্যালোচনায় সহায়ক। চিকিৎসক সিদ্ধান্ত নেন।",
              )}
            </p>
            <Link
              className="button button-primary"
              href="/upload"
              onClick={() => setHelp(false)}
            >
              {t("Upload a record", "রেকর্ড আপলোড করুন")}
              <Plus size={16} />
            </Link>
          </div>
        </Modal>
      )}
      {profile && (
        <Modal
          title={t("Your profile", "আপনার প্রোফাইল")}
          onClose={() => setProfile(false)}
        >
          <div className="profile-detail">
            <div className="avatar avatar-large">RH</div>
            <h3>Rakib Hasan</h3>
            <p>
              {t(
                "Sample patient · Dhaka, Bangladesh",
                "নমুনা রোগী · ঢাকা, বাংলাদেশ",
              )}
            </p>
            <div className="profile-fields">
              <span>{t("Patient ID", "রোগীর আইডি")}</span>
              <strong>NRA-2026-001</strong>
              <span>{t("Workspace", "ওয়ার্কস্পেস")}</span>
              <strong>
                {t("Personal health memory", "ব্যক্তিগত স্বাস্থ্য স্মৃতি")}
              </strong>
              <span>{t("Records", "রেকর্ড")}</span>
              <strong>{records.length}</strong>
            </div>
            <Link
              href="/settings"
              className="button button-secondary"
              onClick={() => setProfile(false)}
            >
              {t("Manage preferences", "পছন্দ পরিচালনা করুন")}
              <Settings2 size={15} />
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
}
