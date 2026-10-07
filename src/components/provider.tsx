"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { sampleRecords, type MedicalRecord } from "@/lib/records";

type Language = "en" | "bn";
type Context = {
  language: Language;
  setLanguage: (value: Language) => void;
  t: (english: string, bangla: string) => string;
  records: MedicalRecord[];
  addRecord: (record: MedicalRecord) => void;
  toast: (message: string) => void;
  downloadSummary: () => void;
};
const HealthContext = createContext<Context | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>("en");
  const [records, setRecords] = useState(sampleRecords);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nira-language");
      if (stored === "bn") updateLanguage("bn");
      const saved = JSON.parse(localStorage.getItem("nira-records") || "[]");
      if (Array.isArray(saved)) {
        const valid = saved.filter(
          (r: MedicalRecord) =>
            r &&
            typeof r.id === "string" &&
            typeof r.date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
            !Number.isNaN(Date.parse(r.date)) &&
            typeof r.title === "string" &&
            typeof r.finding === "string" &&
            ["lab", "prescription", "hospital"].includes(r.kind),
        );
        setRecords([...valid, ...sampleRecords]);
      }
    } catch {
      /* Browsing remains available when local storage is unavailable. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  const setLanguage = (value: Language) => {
    updateLanguage(value);
    try {
      localStorage.setItem("nira-language", value);
    } catch {
      /* Optional preference. */
    }
  };
  const addRecord = (record: MedicalRecord) => {
    const next = [record, ...records];
    localStorage.setItem(
      "nira-records",
      JSON.stringify(next.filter((r) => r.isUploaded)),
    );
    setRecords(next);
  };
  const toast = useCallback((value: string) => setMessage(value), []);
  const t = (english: string, bangla: string) =>
    language === "bn" ? bangla : english;
  const downloadSummary = () => {
    const body = [
      t("NIRA · MEDICAL MEMORY SUMMARY", "নীরা · স্বাস্থ্য স্মৃতির সারাংশ"),
      t(
        "Demo record — for doctor review. Not a diagnosis.",
        "ডেমো রেকর্ড — ডাক্তারের পর্যালোচনার জন্য। এটি রোগ নির্ণয় নয়।",
      ),
      "",
      ...[...records]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(
          (r) =>
            `${r.date} | ${language === "bn" ? r.titleBn : r.title}\n${r.finding}\n${r.provider}\n${t("Source", "উৎস")}: ${r.fileName}\n${language === "bn" ? r.explanationBn : r.explanation}\n`,
        ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "nira-medical-summary.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(
      t("Your summary has been downloaded.", "আপনার সারাংশ ডাউনলোড হয়েছে।"),
    );
  };
  return (
    <HealthContext.Provider
      value={{
        language,
        setLanguage,
        t,
        records,
        addRecord,
        toast,
        downloadSummary,
      }}
    >
      {children}
      {message && (
        <div className="toast" role="status">
          <span className="status-dot" />
          {message}
          <button
            aria-label={t("Dismiss notification", "বিজ্ঞপ্তি বন্ধ করুন")}
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error("HealthProvider is required.");
  return value;
}
