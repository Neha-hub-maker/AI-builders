"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  FileText,
  Languages,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useHealth } from "./provider";
import { formatDate, getOriginal, type MedicalRecord } from "@/lib/records";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`logo ${light ? "logo-light" : ""}`}
      aria-label="Nira home"
    >
      <span className="logo-mark">
        <Activity size={23} strokeWidth={2.3} />
      </span>
      <span>
        nira<span className="logo-period">.</span>
      </span>
    </Link>
  );
}

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useHealth();
  return (
    <button
      className={`language-switch ${compact ? "compact" : ""}`}
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      aria-label={t("Switch language to Bangla", "ইংরেজিতে পরিবর্তন করুন")}
    >
      <Languages size={16} />
      <span>{language === "en" ? "EN" : "বাংলা"}</span>
      <span className="language-separator">/</span>
      <span className="language-alt">{language === "en" ? "বাংলা" : "EN"}</span>
      {!compact && <ChevronDown size={12} />}
    </button>
  );
}

export function Tag({
  children,
  color = "green",
}: {
  children: ReactNode;
  color?: "green" | "blue" | "amber" | "neutral";
}) {
  return <span className={`tag tag-${color}`}>{children}</span>;
}

export function AiLabel({ children }: { children?: ReactNode }) {
  const { t } = useHealth();
  return (
    <span className="ai-label">
      <Sparkles size={13} />
      {children || t("Nira intelligence", "নীরা ইন্টেলিজেন্স")}
    </span>
  );
}

export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const { t } = useHealth();
  useEffect(() => {
    const before = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const focusable = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex="0"]',
          ) || [],
        );
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handle);
      before?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <h2 id={id}>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={t("Close dialog", "বন্ধ করুন")}
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

export function DocumentButton({ record }: { record: MedicalRecord }) {
  const [show, setShow] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { t, language, toast } = useHealth();
  useEffect(
    () => () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    },
    [fileUrl],
  );
  const open = async () => {
    if (record.isUploaded && !record.id.startsWith("sample-")) {
      setLoading(true);
      try {
        const original = await getOriginal(record.id);
        if (!original) {
          toast(
            t(
              "This original file is no longer available in this browser.",
              "এই ব্রাউজারে মূল ফাইলটি আর পাওয়া যাচ্ছে না।",
            ),
          );
          return;
        }
        setFileUrl(URL.createObjectURL(original));
        setShow(true);
      } catch {
        toast(
          t(
            "Unable to open the local file. Please upload it again.",
            "স্থানীয় ফাইল খুলতে ব্যর্থ। আবার আপলোড করুন।",
          ),
        );
      } finally {
        setLoading(false);
      }
    } else setShow(true);
  };
  return (
    <>
      <button
        className="text-link document-link"
        onClick={open}
        disabled={loading}
      >
        <FileText size={14} />
        {loading
          ? t("Opening…", "খুলছে…")
          : t("Original document", "মূল ডকুমেন্ট")}
        <ArrowUpRight size={13} />
      </button>
      {show && (
        <Modal
          title={t("Source document", "মূল ডকুমেন্ট")}
          onClose={() => setShow(false)}
          wide
        >
          {fileUrl ? (
            <div className="original-file">
              <p>{record.fileName}</p>
              <a
                href={fileUrl}
                download={record.fileName}
                className="button button-primary"
              >
                <ArrowDownToLine size={16} />
                {t("Download original file", "মূল ফাইল ডাউনলোড করুন")}
              </a>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-secondary"
              >
                {t("Open in a new tab", "নতুন ট্যাবে খুলুন")}
                <ArrowUpRight size={16} />
              </a>
            </div>
          ) : (
            <div className="sample-document">
              <Tag color="amber">
                {t("Illustrative sample document", "উদাহরণ ডকুমেন্ট")}
              </Tag>
              <div className="sample-document-logo">
                <Activity size={24} />
                {record.provider}
              </div>
              <h3>{language === "bn" ? record.titleBn : record.title}</h3>
              <p>
                {t("Patient", "রোগী")}: Rakib Hasan &nbsp; · &nbsp;{" "}
                {formatDate(record.date, language)}
              </p>
              <hr />
              <div className="document-table">
                <span>{t("Reported information", "রিপোর্টের তথ্য")}</span>
                <strong>{record.finding}</strong>
                {record.medicine && (
                  <>
                    <span>{t("Medication", "ওষুধ")}</span>
                    <strong>{record.medicine}</strong>
                  </>
                )}
              </div>
              <p className="muted small">
                {t(
                  "This is a fictional record used to demonstrate evidence-linked medical memory. It is not a real clinical report.",
                  "এটি স্বাস্থ্য স্মৃতি দেখানোর জন্য তৈরি একটি কাল্পনিক রেকর্ড। এটি প্রকৃত ক্লিনিক্যাল রিপোর্ট নয়।",
                )}
              </p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export function HemoglobinChart({ compact = false }: { compact?: boolean }) {
  const { t } = useHealth();
  const svgId = useId().replace(/:/g, "");
  return (
    <div className={`health-chart ${compact ? "chart-compact" : ""}`}>
      <svg
        viewBox="0 0 340 155"
        role="img"
        aria-label={t(
          "Sample hemoglobin trend: January 13.4, March 12.1, August 11.2 grams per deciliter",
          "নমুনা হিমোগ্লোবিন: জানুয়ারি ১৩.৪, মার্চ ১২.১, আগস্ট ১১.২ গ্রাম প্রতি ডেসিলিটার",
        )}
      >
        <defs>
          <linearGradient id={svgId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#258b7b" stopOpacity=".16" />
            <stop offset="100%" stopColor="#258b7b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 65, 105].map((y, i) => (
          <g key={y}>
            <line
              x1="28"
              y1={y}
              x2="324"
              y2={y}
              stroke="#dfe9e5"
              strokeDasharray="3 5"
            />
            <text x="0" y={y + 4} fill="#80948d" fontSize="10">
              {14 - i * 2}
            </text>
          </g>
        ))}
        <path
          d="M40 38 C94 38 126 69 174 74 S257 98 312 103 L312 125 L40 125 Z"
          fill={`url(#${svgId})`}
        />
        <path
          d="M40 38 C94 38 126 69 174 74 S257 98 312 103"
          fill="none"
          stroke="#258b7b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {[
          [40, 38, "13.4"],
          [174, 74, "12.1"],
          [312, 103, "11.2"],
        ].map(([x, y, label]) => (
          <g key={label}>
            <circle
              cx={x}
              cy={y}
              r="5"
              fill="#fff"
              stroke="#258b7b"
              strokeWidth="2.5"
            />
            <text
              x={x}
              y={Number(y) - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#2d675c"
            >
              {label}
            </text>
          </g>
        ))}
        <text x="40" y="148" textAnchor="middle" fill="#778c84" fontSize="10">
          {t("JAN", "জানু")}
        </text>
        <text x="174" y="148" textAnchor="middle" fill="#778c84" fontSize="10">
          {t("MAR", "মার্চ")}
        </text>
        <text x="312" y="148" textAnchor="middle" fill="#778c84" fontSize="10">
          {t("AUG", "আগস্ট")}
        </text>
      </svg>
    </div>
  );
}

export function ReviewNote() {
  const { t } = useHealth();
  return (
    <div className="review-note">
      <ShieldCheck size={15} />
      <span>
        {t(
          "AI remembers. Your doctor decides.",
          "AI মনে রাখে। আপনার ডাক্তার সিদ্ধান্ত নেন।",
        )}
      </span>
    </div>
  );
}

export function Verified({ verified }: { verified: boolean }) {
  const { t } = useHealth();
  return (
    <span className={`verified ${verified ? "" : "pending"}`}>
      {verified ? <Check size={12} /> : <span className="tiny-dot" />}
      {verified
        ? t("Sample verified", "নমুনা যাচাইকৃত")
        : t("For doctor review", "ডাক্তারের পর্যালোচনার জন্য")}
    </span>
  );
}
