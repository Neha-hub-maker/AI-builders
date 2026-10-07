"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCheck,
  CircleCheck,
  FileImage,
  FileText,
  Layers3,
  Link2,
  LockKeyhole,
  Plus,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
  X,
} from "lucide-react";
import { useHealth } from "./provider";
import { AiLabel, ReviewNote, Tag } from "./ui";
import {
  storeOriginal,
  type MedicalRecord,
  type RecordKind,
} from "@/lib/records";

type Stage = "idle" | "processing" | "review" | "saved";
const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  title: "",
  provider: "",
  finding: "",
  medicine: "",
  diagnosis: "",
  hemoglobin: "",
  kind: "lab" as RecordKind,
};

export function UploadPage() {
  const { t, addRecord, toast } = useHealth();
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [sample, setSample] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const steps = [
    t("Reading document", "ডকুমেন্ট পড়া"),
    t("Extracting medical information", "মেডিক্যাল তথ্য সংগ্রহ"),
    t("Understanding recorded diagnosis", "রেকর্ডের রোগনির্ণয় বোঝা"),
    t("Connecting previous history", "আগের ইতিহাস সংযুক্ত করা"),
    t("Preparing medical timeline", "মেডিক্যাল টাইমলাইন প্রস্তুত"),
  ];
  useEffect(() => {
    if (stage !== "processing") return;
    const timer = setInterval(
      () => setStep((value) => Math.min(value + 1, 5)),
      700,
    );
    return () => clearInterval(timer);
  }, [stage]);
  useEffect(() => {
    if (stage === "processing" && step === 5) setStage("review");
  }, [step, stage]);
  const begin = (selected: File | null, isSample = false) => {
    setError("");
    if (selected) {
      const allowed = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (!allowed.includes(selected.type)) {
        setError(
          t(
            "Choose a PDF, JPG, PNG, or WebP file.",
            "PDF, JPG, PNG বা WebP ফাইল বেছে নিন।",
          ),
        );
        return;
      }
      if (selected.size > 20 * 1024 * 1024) {
        setError(
          t(
            "The file is too large. The maximum size is 20 MB.",
            "ফাইলটি বড়। সর্বোচ্চ আকার ২০ MB।",
          ),
        );
        return;
      }
      if (!selected.size) {
        setError(
          t(
            "This file is empty. Please choose another file.",
            "ফাইলটি খালি। অন্য ফাইল বেছে নিন।",
          ),
        );
        return;
      }
    }
    setFile(selected);
    setSample(isSample);
    setStep(0);
    setConfirmed(false);
    setForm(
      isSample
        ? {
            date: "2026-03-12",
            title: "Complete blood count (CBC)",
            provider: "Ibn Sina Diagnostic Centre",
            finding: "Hemoglobin · 12.1 g/dL",
            medicine: "Example medicine — sample only",
            diagnosis: "Example recorded diagnosis — sample only",
            hemoglobin: "12.1",
            kind: "lab",
          }
        : { ...initialForm },
    );
    setStage("processing");
  };
  const reset = () => {
    setStage("idle");
    setFile(null);
    setSample(false);
    setStep(0);
    setError("");
    setConfirmed(false);
    setSavedId("");
    if (input.current) input.current.value = "";
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!confirmed || saving) return;
    setSaving(true);
    setError("");
    const id = `${sample ? "sample" : "upload"}-${crypto.randomUUID()}`;
    try {
      if (file) await storeOriginal(id, file);
      const record: MedicalRecord = {
        id,
        date: form.date,
        title: form.title.trim(),
        titleBn: sample ? "সম্পূর্ণ রক্ত পরীক্ষা (CBC)" : form.title.trim(),
        kind: form.kind,
        provider:
          form.provider.trim() ||
          t("Patient-provided record", "রোগীর দেওয়া রেকর্ড"),
        finding: form.finding.trim(),
        explanation: sample
          ? "An illustrative CBC record, connected to your medical timeline. The details are sample information for doctor review."
          : "You reviewed and entered the details from this document. The original file is saved locally and remains linked for doctor review.",
        explanationBn: sample
          ? "একটি উদাহরণ CBC রেকর্ড, আপনার স্বাস্থ্য টাইমলাইনের সঙ্গে সংযুক্ত। নমুনা তথ্য ডাক্তারের পর্যালোচনার জন্য।"
          : "আপনি এই ডকুমেন্টের তথ্য যাচাই করে যোগ করেছেন। মূল ফাইল স্থানীয়ভাবে সংরক্ষিত ও ডাক্তারের পর্যালোচনার জন্য সংযুক্ত।",
        fileName: file?.name || "Sample_CBC_March_2026.pdf",
        verified: false,
        isUploaded: true,
        ...(form.hemoglobin ? { hemoglobin: Number(form.hemoglobin) } : {}),
        medicine: form.medicine.trim() || undefined,
        diagnosis: form.diagnosis.trim() || undefined,
      };
      addRecord(record);
      setSavedId(id);
      setStage("saved");
      toast(
        t(
          "A new chapter has been added to your medical memory.",
          "আপনার স্বাস্থ্য স্মৃতিতে নতুন অধ্যায় যোগ হয়েছে।",
        ),
      );
    } catch {
      setError(
        t(
          "The record could not be saved. Browser storage may be unavailable or full. Your existing records are unchanged.",
          "রেকর্ড সংরক্ষণ হয়নি। ব্রাউজার স্টোরেজ অনুপলব্ধ বা পূর্ণ হতে পারে। আগের রেকর্ড অপরিবর্তিত আছে।",
        ),
      );
    } finally {
      setSaving(false);
    }
  };
  const update = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  return (
    <div className="upload-page page-enter">
      <div className="page-heading">
        <div>
          <div className="page-overline">
            <Sparkles size={14} />
            {t("A NEW CHAPTER IN YOUR STORY", "আপনার গল্পে নতুন অধ্যায়")}
          </div>
          <h1>{t("Every record matters.", "প্রতিটি রেকর্ড গুরুত্বপূর্ণ।")}</h1>
          <p>
            {t(
              "Bring your records together. Let your health story connect.",
              "আপনার রেকর্ড একত্র করুন। স্বাস্থ্য গল্প সংযুক্ত হোক।",
            )}
          </p>
        </div>
        <Tag color="neutral">
          <LockKeyhole size={13} />
          {t("Private, local demo", "ব্যক্তিগত, স্থানীয় ডেমো")}
        </Tag>
      </div>
      <div className="upload-layout">
        <div className="upload-main">
          <div
            className="upload-step-nav"
            aria-label={t("Upload progress", "আপলোডের অগ্রগতি")}
          >
            {[
              t("Upload record", "রেকর্ড আপলোড"),
              t("AI understanding", "AI উপলব্ধি"),
              t("Review & connect", "যাচাই ও সংযোগ"),
            ].map((label, index) => (
              <div
                className={
                  (stage === "idle" ? 0 : stage === "processing" ? 1 : 2) >=
                  index
                    ? "step-active"
                    : ""
                }
                key={label}
              >
                <span>
                  {stage === "saved" ||
                  (stage !== "idle" && index === 0) ||
                  (stage === "review" && index === 1) ? (
                    <Check size={13} />
                  ) : (
                    index + 1
                  )}
                </span>
                <strong>{label}</strong>
                {index < 2 && <div className="step-nav-line" />}
              </div>
            ))}
          </div>
          {stage === "idle" && (
            <section className="card upload-drop-card">
              <div className="upload-card-title">
                <h2>
                  {t(
                    "Upload your medical records",
                    "আপনার মেডিক্যাল রেকর্ড আপলোড করুন",
                  )}
                </h2>
                <p lang="bn">আপনার medical report upload করুন</p>
              </div>
              <input
                ref={input}
                className="visually-hidden"
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                aria-label={t(
                  "Choose medical document",
                  "মেডিক্যাল ডকুমেন্ট বেছে নিন",
                )}
                tabIndex={-1}
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) begin(selected);
                }}
              />
              <div
                className={`drop-zone ${dragging ? "dragging" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={t(
                  "Drop a medical file or browse files",
                  "ফাইল ড্রপ করুন বা বেছে নিন",
                )}
                onClick={() => input.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    input.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  if (e.dataTransfer.files.length > 1) {
                    setError(
                      t(
                        "Upload one document at a time so you can review every detail.",
                        "প্রতিটি তথ্য যাচাই করতে একবারে একটি ডকুমেন্ট আপলোড করুন।",
                      ),
                    );
                    return;
                  }
                  const selected = e.dataTransfer.files[0];
                  if (selected) begin(selected);
                }}
              >
                <div className="upload-cloud">
                  <UploadCloud size={31} strokeWidth={1.6} />
                  <span>
                    <Plus size={12} />
                  </span>
                </div>
                <h3>
                  {t(
                    "A new piece of your health story.",
                    "আপনার স্বাস্থ্য গল্পের নতুন অংশ।",
                  )}
                </h3>
                <p>
                  {t(
                    "Drag & drop your report here, or",
                    "এখানে রিপোর্ট ড্রপ করুন, অথবা",
                  )}{" "}
                  <strong>{t("browse files", "ফাইল বেছে নিন")}</strong>
                </p>
                <span className="drop-formats">
                  PDF, JPG, PNG, WebP <span>·</span>{" "}
                  {t("Up to 20 MB", "সর্বোচ্চ ২০ MB")}
                </span>
                <div className="drop-supported">
                  <span>
                    <FileText size={13} />
                    {t("Lab reports", "ল্যাব রিপোর্ট")}
                  </span>
                  <span>
                    <Stethoscope size={13} />
                    {t("Prescriptions", "প্রেসক্রিপশন")}
                  </span>
                  <span>
                    <FileImage size={13} />
                    {t("Hospital records", "হাসপাতালের রেকর্ড")}
                  </span>
                </div>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="upload-local-note">
                <ShieldCheck size={15} />
                <p>
                  {t(
                    "Your file stays in this browser. This prototype previews the AI workflow; real extraction requires a connected AI service. You’ll enter and verify your record details.",
                    "আপনার ফাইল এই ব্রাউজারেই থাকে। এই প্রোটোটাইপ AI প্রক্রিয়া দেখায়; প্রকৃত তথ্য সংগ্রহের জন্য AI সেবা প্রয়োজন। আপনি রেকর্ডের তথ্য যোগ ও যাচাই করবেন।",
                  )}
                </p>
              </div>
              <div className="sample-try">
                <div className="sample-icon">
                  <Sparkles size={19} />
                </div>
                <div>
                  <strong>
                    {t(
                      "Curious? See the memory come together.",
                      "কৌতূহলী? স্মৃতি কীভাবে তৈরি হয় দেখুন।",
                    )}
                  </strong>
                  <p>
                    {t(
                      "Try an example CBC report — no personal data needed.",
                      "নমুনা CBC রিপোর্ট দেখুন — ব্যক্তিগত তথ্য লাগে না।",
                    )}
                  </p>
                </div>
                <button
                  className="button button-secondary button-small"
                  onClick={() => begin(null, true)}
                >
                  {t("Try a sample", "নমুনা দেখুন")}
                  <ArrowRight size={14} />
                </button>
              </div>
            </section>
          )}
          {stage === "processing" && (
            <section className="card processing-card" aria-live="polite">
              <div className="processing-top">
                <AiLabel />
                <Tag color="neutral">
                  {t("Prototype preview", "প্রোটোটাইপ প্রিভিউ")}
                </Tag>
              </div>
              <div className="processing-visual">
                <div className="processing-orbit" />
                <div className="processing-orbit inner" />
                <div className="processing-node">
                  <Activity size={38} />
                </div>
                <span className="process-file">
                  <FileText size={22} />
                </span>
                <span className="process-connected">
                  <Link2 size={20} />
                </span>
              </div>
              <h2>
                {t("From a document", "একটি ডকুমেন্ট থেকে")}
                <br />
                <span>{t("to a connected story.", "একটি সংযুক্ত গল্পে।")}</span>
              </h2>
              <p>
                {sample
                  ? t(
                      "Exploring the AI workflow with an illustrative report.",
                      "উদাহরণ রিপোর্ট দিয়ে AI প্রক্রিয়া দেখানো হচ্ছে।",
                    )
                  : t(
                      "Previewing the workflow. Enter your document details in the next step.",
                      "প্রক্রিয়ার প্রিভিউ। পরের ধাপে ডকুমেন্টের তথ্য যোগ করুন।",
                    )}
              </p>
              <div className="processing-file">
                <FileText size={16} />
                <span>{file?.name || "Sample_CBC_March_2026.pdf"}</span>
                <Tag>
                  {sample
                    ? t("Sample", "নমুনা")
                    : `${((file?.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                </Tag>
              </div>
              <div className="processing-step-list">
                {steps.map((label, index) => (
                  <div
                    className={
                      step > index
                        ? "complete"
                        : step === index
                          ? "current"
                          : ""
                    }
                    key={label}
                  >
                    <span>
                      {step > index ? (
                        <Check size={13} />
                      ) : step === index ? (
                        <span className="processing-spinner" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <strong>{label}</strong>
                    {step > index && (
                      <span className="step-done">
                        {t("Previewed", "প্রিভিউ হয়েছে")}
                      </span>
                    )}
                    {step === index && (
                      <span className="step-running">
                        {t("In progress", "চলছে")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={step * 20}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t(
                  "Workflow preview progress",
                  "প্রক্রিয়ার প্রিভিউ অগ্রগতি",
                )}
              >
                <span style={{ width: `${step * 20}%` }} />
              </div>
              <button className="text-link muted" onClick={reset}>
                <X size={13} />
                {t("Cancel preview", "প্রিভিউ বাতিল")}
              </button>
            </section>
          )}
          {stage === "review" && (
            <section className="card review-upload-card">
              <div className="review-upload-heading">
                <div className="review-success-icon">
                  <CheckCheck size={24} />
                </div>
                <div>
                  <Tag>
                    {sample
                      ? t("SAMPLE PREVIEW READY", "নমুনা প্রিভিউ প্রস্তুত")
                      : t(
                          "READY FOR YOUR REVIEW",
                          "আপনার যাচাইয়ের জন্য প্রস্তুত",
                        )}
                  </Tag>
                  <h2>
                    {t(
                      "The details make the story.",
                      "তথ্যগুলোই গল্প তৈরি করে।",
                    )}
                  </h2>
                  <p>
                    {sample
                      ? t(
                          "Illustrative extracted information. Review before connecting.",
                          "উদাহরণ তথ্য। সংযুক্ত করার আগে যাচাই করুন।",
                        )
                      : t(
                          "Enter the details exactly as written in your original document.",
                          "মূল ডকুমেন্ট অনুযায়ী তথ্য যোগ করুন।",
                        )}
                  </p>
                </div>
              </div>
              <div className="review-file">
                <FileText size={18} />
                <span>{file?.name || "Sample_CBC_March_2026.pdf"}</span>
                <button className="text-link" onClick={reset}>
                  {t("Change", "পরিবর্তন")}
                </button>
              </div>
              <form onSubmit={save}>
                <div className="record-form-grid">
                  <label>
                    {t("Document date", "ডকুমেন্টের তারিখ")}
                    <input
                      required
                      type="date"
                      value={form.date}
                      max="2099-12-31"
                      min="1900-01-01"
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </label>
                  <label>
                    {t("Record type", "রেকর্ডের ধরন")}
                    <select
                      value={form.kind}
                      onChange={(e) => update("kind", e.target.value)}
                    >
                      <option value="lab">
                        {t("Lab report", "ল্যাব রিপোর্ট")}
                      </option>
                      <option value="prescription">
                        {t("Prescription", "প্রেসক্রিপশন")}
                      </option>
                      <option value="hospital">
                        {t("Hospital record", "হাসপাতালের রেকর্ড")}
                      </option>
                    </select>
                  </label>
                  <label>
                    {t("Test / record title", "পরীক্ষা / রেকর্ডের নাম")}
                    <input
                      required
                      maxLength={120}
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder={t(
                        "e.g. Complete blood count",
                        "যেমন: সম্পূর্ণ রক্ত পরীক্ষা",
                      )}
                    />
                  </label>
                  <label>
                    {t("Healthcare provider", "স্বাস্থ্যসেবা প্রতিষ্ঠান")}
                    <input
                      maxLength={120}
                      value={form.provider}
                      onChange={(e) => update("provider", e.target.value)}
                      placeholder={t(
                        "Hospital, lab, or doctor",
                        "হাসপাতাল, ল্যাব বা ডাক্তার",
                      )}
                    />
                  </label>
                  <label className="form-full">
                    {t("Finding from the report", "রিপোর্টের তথ্য")}
                    <input
                      required
                      maxLength={240}
                      value={form.finding}
                      onChange={(e) => update("finding", e.target.value)}
                      placeholder={t(
                        "Copy the reported result — do not infer a diagnosis",
                        "রিপোর্টের ফলাফল লিখুন — রোগ নির্ণয় অনুমান করবেন না",
                      )}
                    />
                  </label>
                  <label>
                    {t("Medication, if recorded", "উল্লেখ থাকলে ওষুধ")}
                    <input
                      maxLength={160}
                      value={form.medicine}
                      onChange={(e) => update("medicine", e.target.value)}
                      placeholder={t("Not recorded", "উল্লেখ নেই")}
                    />
                  </label>
                  <label>
                    {t("Diagnosis, if recorded", "উল্লেখ থাকলে রোগনির্ণয়")}
                    <input
                      maxLength={160}
                      value={form.diagnosis}
                      onChange={(e) => update("diagnosis", e.target.value)}
                      placeholder={t(
                        "Only what the clinician recorded",
                        "শুধু চিকিৎসকের লেখা তথ্য",
                      )}
                    />
                  </label>
                  {form.kind === "lab" && (
                    <label>
                      {t(
                        "Hemoglobin (optional, g/dL)",
                        "হিমোগ্লোবিন (ঐচ্ছিক, g/dL)",
                      )}
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="30"
                        value={form.hemoglobin}
                        onChange={(e) => update("hemoglobin", e.target.value)}
                        placeholder="e.g. 12.1"
                      />
                    </label>
                  )}
                </div>
                <div className="review-check">
                  <input
                    type="checkbox"
                    id="review-confirm"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  <label htmlFor="review-confirm">
                    {t(
                      "I reviewed these details against the document. This is not a medical diagnosis or doctor verification.",
                      "আমি ডকুমেন্ট অনুযায়ী তথ্য যাচাই করেছি। এটি রোগ নির্ণয় বা ডাক্তারের যাচাই নয়।",
                    )}
                  </label>
                </div>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="review-form-bottom">
                  <ReviewNote />
                  <button
                    className="button button-primary"
                    disabled={
                      !confirmed ||
                      saving ||
                      !form.title.trim() ||
                      !form.finding.trim()
                    }
                    type="submit"
                  >
                    {saving
                      ? t("Saving…", "সংরক্ষণ হচ্ছে…")
                      : t(
                          "Connect to my timeline",
                          "আমার টাইমলাইনে যুক্ত করুন",
                        )}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </section>
          )}
          {stage === "saved" && (
            <section className="card upload-saved">
              <div className="saved-rings">
                <div>
                  <CircleCheck size={44} strokeWidth={1.4} />
                </div>
              </div>
              <Tag>
                {t("A NEW CHAPTER, CONNECTED", "নতুন অধ্যায়, সংযুক্ত")}
              </Tag>
              <h2>
                {t("Your memory just", "আপনার স্মৃতি এখন")}
                <br />
                <span>{t("got a little richer.", "আরও সমৃদ্ধ।")}</span>
              </h2>
              <p>
                {t(
                  "Your record is saved in this browser and linked to your timeline. The original stays with its story.",
                  "আপনার রেকর্ড এই ব্রাউজারে সংরক্ষিত ও টাইমলাইনে যুক্ত। মূল ডকুমেন্ট গল্পের সঙ্গে থাকে।",
                )}
              </p>
              <div className="saved-record">
                <FileText size={20} />
                <div>
                  <strong>{form.title}</strong>
                  <span>
                    {form.date} ·{" "}
                    {form.provider || t("Patient-provided", "রোগীর দেওয়া")}
                  </span>
                </div>
                <Check size={17} />
              </div>
              <div className="saved-actions">
                <Link
                  href={`/timeline?record=${savedId}`}
                  className="button button-primary"
                >
                  {t("View in my timeline", "আমার টাইমলাইনে দেখুন")}
                  <ArrowRight size={16} />
                </Link>
                <button className="button button-secondary" onClick={reset}>
                  <Plus size={16} />
                  {t("Add another record", "আরেকটি রেকর্ড যোগ")}
                </button>
              </div>
              <ReviewNote />
            </section>
          )}
        </div>
        <aside className="upload-sidebar">
          <section className="card upload-explainer">
            <div className="explainer-icon">
              <Layers3 size={25} />
            </div>
            <h2>
              {t("A record is a moment.", "রেকর্ড একটি মুহূর্ত।")}
              <br />
              <span>{t("Memory is the journey.", "স্মৃতি পুরো পথচলা।")}</span>
            </h2>
            <p>
              {t(
                "A connected history gives each report the context it deserves.",
                "সংযুক্ত ইতিহাস প্রতিটি রিপোর্টকে প্রয়োজনীয় প্রসঙ্গ দেয়।",
              )}
            </p>
            <div className="explainer-steps">
              {[
                {
                  icon: ScanLine,
                  title: t("Understand the details", "তথ্য বোঝা"),
                  text: t(
                    "Dates, tests, and recorded findings.",
                    "তারিখ, পরীক্ষা ও রিপোর্টের ফলাফল।",
                  ),
                },
                {
                  icon: Link2,
                  title: t("Connect the dots", "তথ্য সংযুক্ত করা"),
                  text: t(
                    "Bring new records into your history.",
                    "নতুন রেকর্ড ইতিহাসের সঙ্গে যুক্ত করা।",
                  ),
                },
                {
                  icon: Activity,
                  title: t("See the bigger picture", "সম্পূর্ণ চিত্র দেখা"),
                  text: t(
                    "Keep context ready for your doctor.",
                    "ডাক্তারের জন্য বিস্তারিত তথ্য রাখা।",
                  ),
                },
              ].map((item) => (
                <div key={item.title}>
                  <span>
                    <item.icon size={18} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="explainer-bottom">
              <Sparkles size={15} />
              {t(
                "Designed for evidence-linked intelligence",
                "প্রমাণ-সংযুক্ত ইন্টেলিজেন্সের জন্য তৈরি",
              )}
            </div>
          </section>
          <section className="upload-tip">
            <ShieldCheck size={22} />
            <h3>
              {t("You’re always in control.", "নিয়ন্ত্রণ সবসময় আপনার।")}
            </h3>
            <p>
              {t(
                "Review every detail before saving. No file is sent to a server in this demo. Clearing browser data removes local records.",
                "সংরক্ষণের আগে প্রতিটি তথ্য যাচাই করুন। এই ডেমোতে ফাইল সার্ভারে যায় না। ব্রাউজারের তথ্য মুছে দিলে স্থানীয় রেকর্ড হারাবে।",
              )}
            </p>
          </section>
          <div className="upload-format-tip">
            <FileImage size={17} />
            <p>
              {t(
                "A clear photo works, too. Make sure the entire report and date are visible.",
                "পরিষ্কার ছবিও চলবে। পুরো রিপোর্ট ও তারিখ দেখা যাচ্ছে নিশ্চিত করুন।",
              )}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
